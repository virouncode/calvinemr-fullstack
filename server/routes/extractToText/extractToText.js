const express = require("express");
const extractToTextRouter = express.Router();
const extractToTextController = require("../../controllers/extractToTextController");

extractToTextRouter.route("/").post(extractToTextController.postExtractToText);

module.exports = extractToTextRouter;
