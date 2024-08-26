import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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
import writeXMLRouter from "./routes/writeXML/writeXML";
import xanoRouter from "./routes/xano/xano";
import xmlToJSRouter from "./routes/xmlToJs/xmlToJs";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
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
  .use(express.static(join(__dirname, "../client/dist")))
  .use("/api/xano", xanoRouter)
  .use("/api/twilio", twilioRouter)
  .use("/api/writeXML", writeXMLRouter)
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
  res.sendFile(join(__dirname, "../client/dist/index.html"));
});

// SOCKET CONNECTION/DECONNECTION EVENT LISTENERS
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.on("disconnect", (reason) => {
    console.log(`User ${socket.id} disconnected`);
    console.log(reason);
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
