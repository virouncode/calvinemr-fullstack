import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useAuthContext from "../../../hooks/context/useAuthContext";
import FormVerifyPassword from "../../UI/Forms/FormVerifyPassword";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
const LOGIN_URL = "/auth/login";

type VerifyPasswordPatientProps = {
  setVerified: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerifyPasswordPatient = ({ setVerified }: VerifyPasswordPatientProps) => {
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
  const handleCancel = () => {
    navigate("/patient/my-account");
  };
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setPin(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //=============== AUTH =================//
      await xanoPost(LOGIN_URL, "patient", {
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

export default VerifyPasswordPatient;
