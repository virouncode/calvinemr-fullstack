import express from "express";
import {
  authXano,
  deleteXano,
  getXano,
  newPatient,
  newStaff,
  postXano,
  putXano,
  resetPatientPwd,
  resetStaffPwd,
  resetXano,
  tempPassword,
  unlock,
} from "../../controllers/xanoController";

const xanoRouter = express.Router();

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
xanoRouter.route("/reset_staff_password").put(resetStaffPwd);
xanoRouter.route("/reset_patient_password").put(resetPatientPwd);

export default xanoRouter;
