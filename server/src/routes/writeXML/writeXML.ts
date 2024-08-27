import express from "express";
import { postWriteXML } from "../../controllers/writeXMLController";

const writeXMLRouter = express.Router();
writeXMLRouter.route("/").post(postWriteXML);

export default writeXMLRouter;
