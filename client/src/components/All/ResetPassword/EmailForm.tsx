import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import InputEmail from "../../UI/Inputs/InputEmail";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";
import UserTypeRadioGroup from "../../UI/Radio/UserTypeRadioGroup";
axios.defaults.withCredentials = true;

type EmailFormProps = {
  setRequestSent: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  setEmailInput: React.Dispatch<React.SetStateAction<string>>;
  emailInput: string;
};

const EmailForm = ({
  setRequestSent,
  setErrMsg,
  type,
  setType,
  setEmailInput,
  emailInput,
}: EmailFormProps) => {
  //Hooks
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    setType(e.target.value);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailInput) {
      setErrMsg("Please enter an email");
      return;
    }
    //verifier l'email
    try {
      setProgress(true);
      const response = await xanoGet(`/${type}_with_email`, "reset", {
        email: emailInput.toLowerCase(),
      });
      if (!response) {
        setErrMsg(`There is no ${type} account associated with this email`);
        setProgress(false);
        return;
      }
      await axios.get(`/api/xano/temp_password`, {
        params: {
          userType: type,
          email: emailInput.toLowerCase(),
        },
      });
      setRequestSent(true);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to send the request: ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    setErrMsg("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="reset__email-row-radio">
        <UserTypeRadioGroup type={type} handleTypeChange={handleTypeChange} />
      </div>
      <div className="reset__email-row">
        <InputEmail
          value={emailInput}
          onChange={handleChange}
          name="email"
          id="email"
          label="Email:"
          autoFocus={true}
        />
      </div>
      <div className="reset__email-row-btns">
        <SubmitButton disabled={progress} />
        <CancelButton onClick={handleCancel} />
        {progress && <CircularProgressSmall />}
      </div>
    </form>
  );
};

export default EmailForm;
