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
} from "../../controllers/xanoController";

const xanoRouter = express.Router();
xanoRouter.route("/auth").post(authXano);
xanoRouter.route("/reset").post(resetXano);
xanoRouter.route("/new_staff").post(newStaff);
xanoRouter.route("/new_patient").post(newPatient);
xanoRouter.route("/temp_password").get(tempPassword);
xanoRouter.route("/reset_staff_password").put(resetStaffPwd);
xanoRouter.route("/reset_patient_password").put(resetPatientPwd);
xanoRouter.get("/*", getXano);
xanoRouter.post("/*", postXano);
xanoRouter.put("/*", putXano);
xanoRouter.delete("/*", deleteXano);

export default xanoRouter;
