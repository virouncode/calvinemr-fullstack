import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useAuthContext from "../../../hooks/context/useAuthContext";
import FormVerifyPassword from "../../UI/Forms/FormVerifyPassword";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
const LOGIN_URL = "/auth/login";

type VerifyPasswordProps = {
  setVerified: React.Dispatch<React.SetStateAction<boolean>>;
};

const VerifyPassword = ({ setVerified }: VerifyPasswordProps) => {
  //Hooks
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleCancel = () => {
    navigate("/staff/my-account");
  };
  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setPassword(e.target.value);
  };
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setPin(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //=============== AUTH =================//
      await xanoPost(LOGIN_URL, "staff", {
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
      <div className="verify-pwd__title">
        Please enter your password and PIN
      </div>
      <form className="verify-pwd__form" onSubmit={handleSubmit}>
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
