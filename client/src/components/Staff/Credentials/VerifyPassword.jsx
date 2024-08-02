import { useState } from "react";

import { useNavigate } from "react-router-dom";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useAuthContext from "../../../hooks/context/useAuthContext";

const VerifyPassword = ({ setVerified }) => {
  const LOGIN_URL = "/auth/login";
  const { auth } = useAuthContext();
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/staff/my-account");
  };
  const handlePwdChange = (e) => {
    setErrMsg("");
    setPassword(e.target.value);
  };
  const handlePinChange = (e) => {
    setErrMsg("");
    setPin(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //=============== AUTH =================//
      await xanoPost(LOGIN_URL, "staff", {
        email: auth.email,
        password,
        pin,
      });
      setVerified(true);
    } catch (err) {
      setVerified(false);
      setErrMsg("Invalid Password");
    }
  };
  return (
    <div className="verify-pwd" style={{ border: errMsg && "solid 1px red" }}>
      <div className="verify-pwd-title">Please enter your password and PIN</div>
      <form className="verify-pwd-form" onSubmit={handleSubmit}>
        {errMsg && <div className="verify-pwd-err">{errMsg}</div>}
        <div className="verify-pwd-form-row">
          <label htmlFor="pwd">Password</label>
          <input
            type="password"
            value={password}
            id="pwd"
            onChange={handlePwdChange}
            autoFocus
          />
        </div>
        <div className="verify-pwd-form-row">
          <label htmlFor="pin">PIN</label>
          <input
            type="password"
            value={pin}
            id="pin"
            onChange={handlePinChange}
          />
        </div>
        <div className="verify-pwd-form-row verify-pwd-form-row--submit">
          <input type="submit" value="Ok" />
          <button onClick={handleCancel} style={{ marginLeft: "5px" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyPassword;
