import express from "express";
import { getWeather } from "../../controllers/weatherController";

var weatherRouter = express.Router();

weatherRouter.route("/").get(getWeather);

export default weatherRouter;
