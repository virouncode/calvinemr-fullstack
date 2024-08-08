import React, { useState } from "react";
import CreditsDialog from "../../UI/Confirm/CreditsDialog";
import LoginForm from "./LoginForm";

const Login = () => {
  const [creditsVisible, setCreditsVisible] = useState<boolean>(false);
  const onConfirm = () => setCreditsVisible(false);
  return (
    <div className="login-container">
      {/* <LoginLogo setCreditsVisible={setCreditsVisible} /> */}
      <LoginForm setCreditsVisible={setCreditsVisible} />
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

export default Login;
