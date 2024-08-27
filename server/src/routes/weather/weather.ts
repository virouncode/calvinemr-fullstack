import express from "express";
import { getWeather } from "../../controllers/weatherController";

const weatherRouter = express.Router();

weatherRouter.route("/").get(getWeather);

export default weatherRouter;
