import express from "express";
import { postEmail } from "../../controllers/mailgunController";
const mailgunRouter = express.Router();

mailgunRouter.route("/").post(postEmail);

export default mailgunRouter;
