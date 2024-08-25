import { useState } from "react";
import React, { Outlet } from "react-router-dom";
import ConfirmGlobal from "../../UI/Confirm/ConfirmGlobal";
import CreditsDialog from "../../UI/Confirm/CreditsDialog";
import LoginHeader from "../Headers/LoginHeader";

const LoginLayout = () => {
  //Hooks
  const [creditsVisible, setCreditsVisible] = useState(false);

  const onConfirm = () => setCreditsVisible(false);
  return (
    <div className="wrapper-login">
      <LoginHeader setCreditsVisible={setCreditsVisible} />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
        <ConfirmGlobal />
      </main>
      {creditsVisible && (
        <CreditsDialog
          onConfirm={onConfirm}
          isPopUp={false}
          props={{
            title: "Credits",
            content:
              "Version 1.0.0\nIssued 2024.07.01\nwww.calvinemr.com\n\n©TVK Investments",
            yes: "Close",
          }}
        />
      )}
    </div>
  );
};

export default LoginLayout;
