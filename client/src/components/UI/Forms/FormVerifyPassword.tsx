import React from "react";
import CancelButton from "../Buttons/CancelButton";
import SubmitButton from "../Buttons/SubmitButton";
import InputPassword from "../Inputs/InputPassword";

type FormVerifyPasswordProps = {
  password: string;
  pin: string;
  handlePwdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const FormVerifyPassword = ({
  password,
  pin,
  handlePwdChange,
  handlePinChange,
  handleCancel,
}: FormVerifyPasswordProps) => {
  return (
    <>
      <div className="verify-pwd__form-row">
        <InputPassword
          value={password}
          onChange={handlePwdChange}
          name="password"
          id="password"
          label="Password"
          autoFocus={true}
        />
      </div>
      <div className="verify-pwd__form-row">
        <InputPassword
          value={pin}
          onChange={handlePinChange}
          name="pin"
          id="pin"
          label="PIN"
        />
      </div>
      <div className="verify-pwd__form-btns">
        <SubmitButton />
        <CancelButton onClick={handleCancel} />
      </div>
    </>
  );
};

export default FormVerifyPassword;
