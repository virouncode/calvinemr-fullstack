var express = require("express");
var mailgunRouter = express.Router();
var mailgunController = require("../../controllers/mailgunController");

mailgunRouter.route("/").post(mailgunController.postEmail);

module.exports = mailgunRouter;
