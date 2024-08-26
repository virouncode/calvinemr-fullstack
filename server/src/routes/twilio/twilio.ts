import express from "express";
import { postTwilio } from "../../controllers/twilioController";

const twilioRouter = express.Router();
twilioRouter.route("/").post(postTwilio);

export default twilioRouter;
