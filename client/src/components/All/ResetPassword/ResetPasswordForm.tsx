import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import xanoPostReset from "../../../api/xanoCRUD/xanoPostReset";
import { PasswordValidityType } from "../../../types/app";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import InputPassword from "../../UI/Inputs/InputPassword";
import PasswordValidator from "../../UI/Inputs/PasswordValidator";

type ResetPasswordFormProps = {
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccesMsg: React.Dispatch<React.SetStateAction<string>>;
  setResetOk: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  tempToken: string;
};

const ResetPasswordForm = ({
  setErrMsg,
  setSuccesMsg,
  setResetOk,
  type,
  tempToken,
}: ResetPasswordFormProps) => {
  //Hooks
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pin, setPin] = useState("");
  const [passwordValidity, setPasswordValidity] =
    useState<PasswordValidityType>({
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      size: false,
    });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsg("");
    const value = e.target.value;
    const newValidity: PasswordValidityType = {
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
      size: false,
    };
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

  const handleSubmitPwd = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (err instanceof Error)
        setErrMsg(`Unable to reset password: ${err.message}`);
    }
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPwd(e.target.value);
    setErrMsg("");
  };
  const handlePINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
    setErrMsg("");
  };

  return (
    <form onSubmit={handleSubmitPwd} className="reset-password-form">
      <div className="reset-password-form-row">
        <InputPassword
          value={pwd}
          onChange={handlePasswordChange}
          name="new-password"
          id="new-password"
          label="Enter a new password:"
          autoFocus={true}
        />
      </div>
      <div className="reset-password-form-row">
        <PasswordValidator passwordValidity={passwordValidity} />
      </div>
      <div className="reset-password-form-row">
        <InputPassword
          value={confirmPwd}
          onChange={handleConfirmPasswordChange}
          name="confirm-password"
          id="confirm-password"
          label="Confirm new password:"
        />
      </div>
      <div className="reset-password-form-row">
        <InputPassword
          value={pin}
          onChange={handlePINChange}
          name="pin"
          id="pin"
          label="Enter a new PIN:"
        />
      </div>
      <div className="reset-password-form-row-btn">
        <SubmitButton />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
