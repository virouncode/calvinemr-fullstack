import React from "react";

const LoginTitle = () => {
  return (
    <h2 className="login__title">
      {`Welcome to ${import.meta.env.VITE_CLINIC_NAME}`}
    </h2>
  );
};

export default LoginTitle;
