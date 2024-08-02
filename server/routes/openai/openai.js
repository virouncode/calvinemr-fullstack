var express = require("express");
var openaiRouter = express.Router();
var openaiController = require("../../controllers/openaiController");

openaiRouter.route("/stream").post(openaiController.postChatGPTStream);
openaiRouter.route("/full").post(openaiController.postChatGPTFull);

module.exports = openaiRouter;
