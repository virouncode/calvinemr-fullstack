import express from "express";
import { postXmlToJs } from "../../controllers/xmlToJsController";

var xmlToJsRouter = express.Router();
xmlToJsRouter.route("/").post(postXmlToJs);

export default xmlToJsRouter;
