import React from "react";
import LoginButton from "../../UI/Buttons/LoginButton";

type LoginBtnContainerProps = {
  loadingStaff: boolean;
  loadingPatient: boolean;
  loadingAdmin: boolean;
  handleSubmitStaff: () => void;
  handleSubmitPatient: () => void;
  handleSubmitAdmin: () => void;
};

const LoginBtnContainer = ({
  loadingStaff,
  loadingPatient,
  loadingAdmin,
  handleSubmitStaff,
  handleSubmitPatient,
  handleSubmitAdmin,
}: LoginBtnContainerProps) => {
  return (
    <div className="login__btn-container">
      <LoginButton
        onClick={handleSubmitStaff}
        disabled={loadingStaff || loadingPatient || loadingAdmin}
        label="Staff"
        loading={loadingStaff}
      />
      <LoginButton
        onClick={handleSubmitPatient}
        disabled={loadingStaff || loadingPatient || loadingAdmin}
        label="Patient"
        loading={loadingPatient}
      />
      <LoginButton
        onClick={handleSubmitAdmin}
        disabled={loadingStaff || loadingPatient || loadingAdmin}
        label="Admin"
        loading={loadingAdmin}
      />
    </div>
  );
};

export default LoginBtnContainer;
