import logo from "@/assets/img/logoRectTest.png";
import React from "react";

type LoginHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoginHeader = ({ setCreditsVisible }: LoginHeaderProps) => {
  return (
    <header className="header header--login">
      <div
        className="header__logo"
        onClick={() => setCreditsVisible((p) => !p)}
      >
        <img src={logo} alt="CalvinEMR-logo" />
      </div>
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default LoginHeader;
