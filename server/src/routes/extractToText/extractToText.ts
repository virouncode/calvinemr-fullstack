import express from "express";
import { postExtractToText } from "../../controllers/extractToTextController";
const extractToTextRouter = express.Router();

extractToTextRouter.route("/").post(postExtractToText);

export default extractToTextRouter;
