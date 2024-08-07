//Imports
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { join } = require("path");
const PORT = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const xanoRouter = require("./routes/xano/xano");
const twilioRouter = require("./routes/twilio/twilio");
const writeXMLRouter = require("./routes/writeXML/writeXML");
const extractToTextRouter = require("./routes/extractToText/extractToText");
const xmlToJSRouter = require("./routes/xmlToJs/xmlToJs");
const srfaxRouter = require("./routes/srfax/srfax");
const openaiRouter = require("./routes/openai/openai");
const mailgunRouter = require("./routes/mailgun/mailgun");
const weatherRouter = require("./routes/weather/weather");

const app = express();
app
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.json({ limit: "50mb" })) //not necessary if all requests are made with axios
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
  //Routes
  .use("/api/xano", xanoRouter)
  .use("/api/twilio", twilioRouter)
  .use("/api/writeXML", writeXMLRouter)
  .use("/api/extractToText", extractToTextRouter)
  .use("/api/xmlToJs", xmlToJSRouter)
  .use("/api/srfax", srfaxRouter)
  .use("/api/openai", openaiRouter)
  .use("/api/mailgun", mailgunRouter)
  .use("/api/weather", weatherRouter);

//my http server
const httpServer = createServer(app);
//Web socket on the server, in production no cors allowed, in dev allow localhost:3000 (the front-end)
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

//****************** SOCKET CONECTION/DECONNECTION EVENT LISTENERS ****************//

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

//***************** SERVER ERROR HANDLING **********************//
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
  io.emit("serverError", {
    message: "Server error occurred. Please try again later.",
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  io.emit("serverError", {
    message: "Server error occurred. Please try again later.",
  });
  process.exit(1);
});

//*******************************************************************//

httpServer.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});
