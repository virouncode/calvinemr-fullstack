import React, { Outlet } from "react-router-dom";
import ConfirmGlobal from "../../UI/Confirm/ConfirmGlobal";
import LoginHeader from "../Headers/LoginHeader";

const LoginLayout = () => {
  return (
    <div className="wrapper-login">
      <LoginHeader />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
        <ConfirmGlobal />
      </main>
    </div>
  );
};

export default LoginLayout;
