import React from "react";
import { CredentialsFormType, PasswordValidityType } from "../../../types/app";
import CancelButton from "../Buttons/CancelButton";
import SubmitButton from "../Buttons/SubmitButton";
import Input from "../Inputs/Input";
import InputPassword from "../Inputs/InputPassword";
import PasswordValidator from "../Inputs/PasswordValidator";

type FormCredentialsProps = {
  credentials: CredentialsFormType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordValidity: PasswordValidityType;
  handleCancel: () => void;
};

const FormCredentials = ({
  credentials,
  handleChange,
  handlePasswordChange,
  passwordValidity,
  handleCancel,
}: FormCredentialsProps) => {
  return (
    <>
      <div className="credentials-form-row">
        <Input
          label="New email"
          id="email"
          onChange={handleChange}
          name="email"
          value={credentials.email}
        />
      </div>
      <div className="credentials-form-row">
        <InputPassword
          label="New password"
          id="password"
          onChange={handlePasswordChange}
          name="password"
          value={credentials.password}
          autoFocus={true}
        />
      </div>
      <div className="credentials-form-row">
        <PasswordValidator passwordValidity={passwordValidity} />
      </div>
      <div className="credentials-form-row">
        <InputPassword
          label="Confirm new password"
          id="confirm-password"
          onChange={handleChange}
          name="confirmPassword"
          value={credentials.confirmPassword}
        />
      </div>
      <div className="credentials-form-row">
        <InputPassword
          label="New PIN"
          id="pin"
          onChange={handleChange}
          name="pin"
          value={credentials.pin}
        />
      </div>
      <div className="credentials-form-row-submit">
        <SubmitButton />
        <CancelButton onClick={handleCancel} />
      </div>
    </>
  );
};

export default FormCredentials;
