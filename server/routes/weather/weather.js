var express = require("express");
var weatherRouter = express.Router();
var weatherController = require("../../controllers/weatherController");

weatherRouter.route("/").get(weatherController.getWeather);

module.exports = weatherRouter;
