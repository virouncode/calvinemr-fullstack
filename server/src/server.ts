import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { join } from "path";
import { Server } from "socket.io";

// Import routers
import axios from "axios";
import extractToTextRouter from "./routes/extractToText/extractToText";
import mailgunRouter from "./routes/mailgun/mailgun";
import openaiRouter from "./routes/openai/openai";
import srfaxRouter from "./routes/srfax/srfax";
import twilioRouter from "./routes/twilio/twilio";
import weatherRouter from "./routes/weather/weather";
import xanoRouter from "./routes/xano/xano";
import xmlToJSRouter from "./routes/xmlToJs/xmlToJs";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app
  .set("trust proxy", true)
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json({ limit: "50mb" }))
  .use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://acrobatservices.adobe.com"]
          : ["http://localhost:5173", "https://acrobatservices.adobe.com"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
  .use(express.static(join(__dirname, "../../client/dist")))
  .use("/api/xano", xanoRouter)
  .use("/api/twilio", twilioRouter)
  .use("/api/extractToText", extractToTextRouter)
  .use("/api/xmlToJs", xmlToJSRouter)
  .use("/api/srfax", srfaxRouter)
  .use("/api/openai", openaiRouter)
  .use("/api/mailgun", mailgunRouter)
  .use("/api/weather", weatherRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://acrobatservices.adobe.com"]
        : ["http://localhost:5173", "https://acrobatservices.adobe.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../../client/dist/index.html"));
});

//Polling Faxes for staff users
let pollingInterval: NodeJS.Timeout | null = null;
let previousUnreadFaxNbr = 0;
const connectedStaff = new Set(); // Track only users with "staff" access

const startPollingFaxes = () => {
  if (!pollingInterval) {
    pollingInterval = setInterval(fetchUnreadFaxes, 10000);
    console.log("Polling started");
  }
};

const stopPollingFaxes = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("Polling stopped");
  }
};

const fetchUnreadFaxes = async () => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/srfax/inbox`,
      {
        viewedStatus: "UNREAD",
        all: true,
        start: "",
        end: "",
      }
    );
    const unreadFaxNbr = response.data.length;
    if (unreadFaxNbr !== previousUnreadFaxNbr) {
      previousUnreadFaxNbr = unreadFaxNbr;
      io.emit("message", {
        action: "create",
        route: "UNREAD FAX",
        content: { data: unreadFaxNbr },
      });
    }
  } catch (error) {
    if (error instanceof Error)
      console.error("Failed to retrieve unread faxes:", error.message);
  }
};

// SOCKET CONNECTION/DECONNECTION EVENT LISTENERS
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("start polling faxes", () => {
    connectedStaff.add(socket.id);
    if (connectedStaff.size === 1) {
      startPollingFaxes(); // Start polling when the first staff member connects
    }
  });
  socket.on("disconnect", (reason) => {
    if (connectedStaff.has(socket.id)) {
      connectedStaff.delete(socket.id);
      if (connectedStaff.size === 0) {
        stopPollingFaxes(); // Stop polling if no staff members are connected
      }
    }
    console.log(`User ${socket.id} disconnected because: ${reason}`);
  });
  socket.on("message", (message) => {
    io.emit("message", message);
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// SERVER ERROR HANDLING
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
  io.emit("serverError", {
    message: "Server error occurred. Please try again later.",
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  io.emit("serverError", {
    message: "Server error occurred. Please try again later.",
  });
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
