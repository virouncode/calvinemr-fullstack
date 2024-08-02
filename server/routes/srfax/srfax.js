var express = require("express");
var srfaxRouter = express.Router();
var srfaxController = require("../../controllers/srfaxController");

srfaxRouter.route("/postFax").post(srfaxController.postFax);
srfaxRouter.route("/inbox").post(srfaxController.getFaxesInbox);
srfaxRouter.route("/outbox").post(srfaxController.getFaxesOutbox);
srfaxRouter.route("/faxFile").post(srfaxController.getFaxFile);
srfaxRouter.route("/deleteFax").post(srfaxController.deleteFax);
srfaxRouter.route("/deleteFaxes").post(srfaxController.deleteFaxes);

module.exports = srfaxRouter;
