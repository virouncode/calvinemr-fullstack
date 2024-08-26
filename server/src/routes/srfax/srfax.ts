import express from "express";
import {
  deleteFax,
  deleteFaxes,
  getFaxesInbox,
  getFaxesOutbox,
  getFaxFile,
  postFax,
} from "../../controllers/srfaxController";
const srfaxRouter = express.Router();

srfaxRouter.route("/postFax").post(postFax);
srfaxRouter.route("/inbox").post(getFaxesInbox);
srfaxRouter.route("/outbox").post(getFaxesOutbox);
srfaxRouter.route("/faxFile").post(getFaxFile);
srfaxRouter.route("/deleteFax").post(deleteFax);
srfaxRouter.route("/deleteFaxes").post(deleteFaxes);

export default srfaxRouter;
