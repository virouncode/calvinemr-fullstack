import { useState } from "react";

import { useNavigate } from "react-router-dom";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import InputPassword from "../../UI/Inputs/InputPassword";

const TempPwdForm = ({
  emailInput,
  type,
  setValidTempPwd,
  setErrMsg,
  setTempToken,
}) => {
  const [tempPwd, setTempPwd] = useState("");
  const navigate = useNavigate();

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleChange = (e) => {
    setErrMsg("");
    setTempPwd(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await xanoPost(`/auth/${type}/temp_login`, "reset", {
        email: emailInput,
        password: tempPwd,
      });
      setTempToken(response.tempToken);
      setValidTempPwd(true);
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="temp-password-form">
      <p>
        Please enter the temporary password we have sent at (
        {emailInput.toLowerCase()}):
      </p>
      <div className="temp-password-form-row">
        <InputPassword
          value={tempPwd}
          onChange={handleChange}
          name="tempPwd"
          id="tempPwd"
          autoFocus={true}
        />
        <div className="temp-password-form-row-btns">
          <SubmitButton />
          <CancelButton onClick={handleCancel} />
        </div>
      </div>
    </form>
  );
};

export default TempPwdForm;
