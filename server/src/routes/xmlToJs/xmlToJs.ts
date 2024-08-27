import express from "express";
import { postXmlToJs } from "../../controllers/xmlToJsController";

const xmlToJsRouter = express.Router();
xmlToJsRouter.route("/").post(postXmlToJs);

export default xmlToJsRouter;
