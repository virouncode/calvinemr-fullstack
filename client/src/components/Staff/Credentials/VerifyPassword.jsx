import { useState } from "react";

import { useNavigate } from "react-router-dom";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useAuthContext from "../../../hooks/context/useAuthContext";
import FormVerifyPassword from "../../UI/Forms/FormVerifyPassword";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

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
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}
        <FormVerifyPassword
          password={password}
          pin={pin}
          handlePwdChange={handlePwdChange}
          handlePinChange={handlePinChange}
          handleCancel={handleCancel}
        />
      </form>
    </div>
  );
};

export default VerifyPassword;
