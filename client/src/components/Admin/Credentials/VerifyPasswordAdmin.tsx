import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useAuthContext from "../../../hooks/context/useAuthContext";
import FormVerifyPassword from "../../UI/Forms/FormVerifyPassword";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
const LOGIN_URL = "/auth/login";

type VerifyPasswordAdminProps = {
  setVerified: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerifyPasswordAdmin = ({ setVerified }: VerifyPasswordAdminProps) => {
  //Hooks
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setPassword(e.target.value);
  };
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setPin(e.target.value);
  };

  const handleCancel = () => {
    navigate("/admin/my-account");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //=============== AUTH =================//
      await xanoPost(LOGIN_URL, "admin", {
        email: auth?.email,
        password,
        pin,
      });
      setVerified(true);
    } catch {
      setVerified(false);
      setErrMsg("Invalid Password");
    }
  };
  return (
    <div className="verify-pwd" style={{ border: errMsg && "solid 1px red" }}>
      <div className="verify-pwd-title">Please enter your password</div>
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

export default VerifyPasswordAdmin;
