import logo from "@/assets/img/logoRectTest.png";
import React from "react";

type LoginHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoginHeader = ({ setCreditsVisible }: LoginHeaderProps) => {
  return (
    <div className="header__container">
      <header
        className="header header--login"
        style={{
          backgroundColor:
            `#${import.meta.env.VITE_LOGIN_BACKGROUND_COLOR}` ?? "",
        }}
      >
        <div
          className="header__logo"
          onClick={() => setCreditsVisible((p) => !p)}
        >
          <img
            src={import.meta.env.VITE_CLINIC_LOGO_URL ?? logo}
            alt="CalvinEMR-logo"
          />
        </div>
        {import.meta.env.VITE_CLINIC_SUBTITLE_URL ? (
          <div
            className="header__title"
            onClick={() => setCreditsVisible((p) => !p)}
          >
            <img
              src={import.meta.env.VITE_CLINIC_SUBTITLE_URL}
              alt="subtitle"
            />
          </div>
        ) : (
          <h1 className="header__title">Electronic Medical Records</h1>
        )}
      </header>
    </div>
  );
};

export default LoginHeader;
