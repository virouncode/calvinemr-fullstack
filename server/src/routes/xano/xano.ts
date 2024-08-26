import express from "express";
import {
  authXano,
  deleteXano,
  getXano,
  newPatient,
  newStaff,
  postEform,
  postXano,
  putXano,
  resetXano,
  tempPassword,
  unlock,
} from "../../controllers/xanoController";

var xanoRouter = express.Router();

xanoRouter
  .route("/")
  .get(getXano)
  .post(postXano)
  .put(putXano)
  .delete(deleteXano);

xanoRouter.route("/auth").post(authXano);
xanoRouter.route("/reset").post(resetXano);
xanoRouter.route("/new_staff").post(newStaff);
xanoRouter.route("/new_patient").post(newPatient);
xanoRouter.route("/temp_password").get(tempPassword);
xanoRouter.route("/unlock").post(unlock);
xanoRouter.route("/eforms").post(postEform);

export default xanoRouter;
