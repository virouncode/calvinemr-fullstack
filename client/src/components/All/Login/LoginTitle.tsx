import React from "react";

const LoginTitle = () => {
  return (
    <div className="login-logo">
      <div className="login-logo__title">{`Welcome to ${
        import.meta.env.VITE_CLINIC_NAME
      }`}</div>
    </div>
  );
};

export default LoginTitle;
