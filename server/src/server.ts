import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { createServer } from "http";
import { join } from "path";
import { Server } from "socket.io";

// Import routers
import extractToTextRouter from "./routes/extractToText/extractToText";
import mailgunRouter from "./routes/mailgun/mailgun";
import openaiRouter from "./routes/openai/openai";
import srfaxRouter from "./routes/srfax/srfax";
import twilioRouter from "./routes/twilio/twilio";
import weatherRouter from "./routes/weather/weather";
import xanoRouter from "./routes/xano/xano";
import xmlToJSRouter from "./routes/xmlToJs/xmlToJs";
import { startPollingFaxes, stopPollingFaxes } from "./utils/faxPolling";
dotenv.config();

const PORT = process.env.PORT || 4000;
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://acrobatservices.adobe.com"] // Production origins
    : ["http://localhost:5173", "https://acrobatservices.adobe.com"]; // Development origins

//========================== EXPRESS APP SETUP =========================//
const app = express();
app
  .use(
    helmet({
      contentSecurityPolicy: false, // because React of inline styles
      crossOriginEmbedderPolicy: false, // to avoid certain blocking with Vite or iframes
    })
  ) //Security middleware, set various HTTP headers to help protect the app
  .set("trust proxy", true) // Trust first proxy
  .use(cookieParser()) //extract cookies from incoming requests and populate req.cookies
  .use(express.urlencoded({ extended: true })) //application/x-www-form-urlencoded body parsing to req.body
  .use(express.json({ limit: "2mb" })) //application/json body parsing to req.body
  .use(express.text()) //text/plain body parsing to req.body
  .use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
  .use("/api/xano", xanoRouter) //delegate /api/xano routes to xanoRouter
  .use("/api/twilio", twilioRouter)
  .use("/api/extractToText", extractToTextRouter)
  .use("/api/xmlToJs", xmlToJSRouter)
  .use("/api/srfax", srfaxRouter)
  .use("/api/openai", openaiRouter)
  .use("/api/mailgun", mailgunRouter)
  .use("/api/weather", weatherRouter)
  .use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: "Not found" });
    } //Unknown /api/* route
    next(); // If not /api/*, continue to next middleware (to serve React frontend)
  });

if (process.env.NODE_ENV === "production") {
  //In production, serve the React frontend
  app.use(express.static(join(__dirname, "../../client/dist"))); //All static files from Vite build
  app.get("*", (req, res) =>
    res.sendFile(join(__dirname, "../../client/dist/index.html"))
  ); //All routes other than /api/* will serve index.html => React takes care of routing with React Router
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}); //Error handling middleware

const httpServer = createServer(app);

//========================== SOCKET.IO SETUP =========================//
const io = new Server(httpServer, {
  cors: {
    //even if CORS is handled by express, socket.io needs it too
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const connectedStaff = new Set(); // Track only users with "staff" access

//New client connection
io.on("connection", (socket) => {
  //socket represents this specific client
  console.log(`User ${socket.id} connected`);
  //Event listeners
  //Polling Faxes for staff users
  socket.on("start polling faxes", () => {
    connectedStaff.add(socket.id);
    if (connectedStaff.size === 1) {
      startPollingFaxes(io); // Start polling if this is the first staff member
    }
  });
  //General message relay
  socket.on("message", (message) => {
    try {
      io.emit("message", message);
    } catch (error) {
      console.error("Error emitting message:", error);
    }
  });
  //User disconnect
  socket.on("disconnect", (reason) => {
    if (connectedStaff.has(socket.id)) {
      connectedStaff.delete(socket.id);
      if (connectedStaff.size === 0) {
        stopPollingFaxes(); // Stop polling if no staff members are connected
      }
    }
    console.log(`User ${socket.id} disconnected because: ${reason}`);
  });
  //Socket connect error
  socket.on("connect_error", (err) => {
    console.log(
      `Socket error (${socket.id}):`,
      err instanceof Error ? err.message : err
    );
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// SERVER ERROR HANDLING
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
  //Send a message to all connected clients
  io.emit("serverError", {
    message: "Server error occurred. Please try again later.",
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  //Send a message to all connected clients
  io.emit("serverError", {
    message: "Server error occurred. Please try again later.",
  });
});

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
