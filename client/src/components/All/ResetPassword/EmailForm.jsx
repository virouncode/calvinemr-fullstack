import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import InputEmail from "../../UI/Inputs/InputEmail";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";
import UserTypeRadioGroup from "../../UI/Radio/UserTypeRadioGroup";

axios.defaults.withCredentials = true;

const EmailForm = ({
  setRequestSent,
  setErrMsg,
  type,
  setType,
  setEmailInput,
  emailInput,
}) => {
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setErrMsg("");
    setType(e.target.value);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
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
      toast.error(`Unable to send the request: ${err.message}`, {
        containerId: "A",
      });
    }
    setProgress(false);
  };

  return (
    <form onSubmit={handleSubmitEmail}>
      <div className="email-form-row-radio">
        <UserTypeRadioGroup type={type} handleTypeChange={handleTypeChange} />
      </div>
      <div className="email-form-row">
        <InputEmail
          value={emailInput}
          onChange={(e) => {
            setEmailInput(e.target.value);
            setErrMsg("");
          }}
          name="email"
          id="email"
          label="Enter your email: "
        />
        <div>
          <SubmitButton disabled={progress} />
          <CancelButton onClick={handleCancel} />
        </div>
        {progress && <CircularProgressSmall />}
      </div>
    </form>
  );
};

export default EmailForm;
