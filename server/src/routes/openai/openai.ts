import express from "express";
import {
  postChatGPTFull,
  postChatGPTStream,
} from "../../controllers/openaiController";
const openaiRouter = express.Router();

openaiRouter.route("/stream").post(postChatGPTStream);
openaiRouter.route("/full").post(postChatGPTFull);

export default openaiRouter;
