import { useState } from "react";
import { useNavigate } from "react-router-dom";

import xanoPostReset from "../../../api/xanoCRUD/xanoPostReset";

const ResetPasswordForm = ({
  setErrMsg,
  setSuccesMsg,
  setResetOk,
  type,
  tempToken,
}) => {
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pin, setPin] = useState("");
  const [passwordValidity, setPasswordValidity] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    size: false,
  });
  const handlePasswordChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    let newValidity = {};
    if (/[A-Z]/.test(value)) {
      newValidity.uppercase = true;
    } else {
      newValidity.uppercase = false;
    }
    if (/[a-z]/.test(value)) {
      newValidity.lowercase = true;
    } else {
      newValidity.lowercase = false;
    }
    if (/[0-9]/.test(value)) {
      newValidity.number = true;
    } else {
      newValidity.number = false;
    }
    if (/\W|_/.test(value)) {
      newValidity.special = true;
    } else {
      newValidity.special = false;
    }
    if (value.length >= 8 && value.length <= 16) {
      newValidity.size = true;
    } else {
      newValidity.size = false;
    }

    setPasswordValidity(newValidity);
    setPwd(value);
  };
  const navigate = useNavigate();
  const handleSubmitPwd = async (e) => {
    e.preventDefault();
    if (pwd !== confirmPwd) {
      setErrMsg("Passwords do not match");
      return;
    }
    if (
      /^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^\w\s]).{8,20}$/.test(
        pwd
      ) === false
    ) {
      setErrMsg("Invalid Password");
      return;
    }
    if (/^\d{4}$/.test(pin) === false) {
      setErrMsg("Invalid PIN (must be 4 digits)");
      return;
    }
    try {
      await xanoPostReset(`/auth/${type}/reset_password`, "reset", tempToken, {
        password: pwd,
        confirm_password: confirmPwd,
        pin,
      });

      setSuccesMsg(
        "Your password and pin have been reset successfully, you will be redirected to the login page"
      );
      setResetOk(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setErrMsg(`Unable to reset password: ${err.message}`);
    }
  };
  return (
    <form onSubmit={handleSubmitPwd} className="reset-password-form">
      <div className="reset-password-form-row">
        <label htmlFor="new-password">Enter a new password:</label>
        <input
          type="password"
          id="new-password"
          value={pwd}
          onChange={handlePasswordChange}
          required
          autoComplete="off"
        />
      </div>
      <div className="reset-password-form-row">
        <ul>
          <li>
            {passwordValidity.size ? (
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
            )}{" "}
            <span
              style={{
                color: passwordValidity.size ? "#0dbc01" : "#ff4d4d",
              }}
            >
              8-20 characters
            </span>
          </li>
          <li>
            {passwordValidity.uppercase ? (
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
            )}{" "}
            <span
              style={{
                color: passwordValidity.uppercase ? "#0dbc01" : "#ff4d4d",
              }}
            >
              At least 1 uppercase letter
            </span>
          </li>
          <li>
            {passwordValidity.lowercase ? (
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
            )}{" "}
            <span
              style={{
                color: passwordValidity.lowercase ? "#0dbc01" : "#ff4d4d",
              }}
            >
              At least 1 lowercase letter
            </span>
          </li>
          <li>
            {passwordValidity.number ? (
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
            )}{" "}
            <span
              style={{
                color: passwordValidity.number ? "#0dbc01" : "#ff4d4d",
              }}
            >
              At least 1 number
            </span>
          </li>
          <li>
            {passwordValidity.special ? (
              <i className="fa-solid fa-check" style={{ color: "#0dbc01" }}></i>
            ) : (
              <i className="fa-solid fa-xmark" style={{ color: "#ff4d4d" }}></i>
            )}{" "}
            <span
              style={{
                color: passwordValidity.special ? "#0dbc01" : "#ff4d4d",
              }}
            >
              At least 1 special character
            </span>
          </li>
        </ul>
      </div>
      <div className="reset-password-form-row">
        <label htmlFor="confirm-password">Confirm new password:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPwd}
          onChange={(e) => {
            setConfirmPwd(e.target.value);
            setErrMsg("");
          }}
          required
          autoComplete="off"
        />
      </div>
      <div className="reset-password-form-row">
        <label htmlFor="pin">New PIN:</label>
        <input
          type="password"
          id="pin"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setErrMsg("");
          }}
          required
          autoComplete="off"
        />
      </div>
      <div className="reset-password-form-row-btn">
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
