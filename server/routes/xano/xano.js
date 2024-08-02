var express = require("express");
var xanoRouter = express.Router();
var xanoController = require("../../controllers/xanoController");

xanoRouter
  .route("/")
  .get(xanoController.getXano)
  .post(xanoController.postXano)
  .put(xanoController.putXano)
  .delete(xanoController.deleteXano);

xanoRouter.route("/auth").post(xanoController.authXano);
xanoRouter.route("/reset").post(xanoController.resetXano);
xanoRouter.route("/new_staff").post(xanoController.newStaff);
xanoRouter.route("/new_patient").post(xanoController.newPatient);
xanoRouter.route("/temp_password").get(xanoController.tempPassword);
xanoRouter.route("/unlock").post(xanoController.unlock);
xanoRouter.route("/eforms").post(xanoController.postEform);

module.exports = xanoRouter;
