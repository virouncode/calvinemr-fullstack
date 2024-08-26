const express = require("express");
const mailgunRouter = express.Router();
const mailgunController = require("../../controllers/mailgunController");

mailgunRouter.route("/").post(mailgunController.postEmail);

module.exports = mailgunRouter;
