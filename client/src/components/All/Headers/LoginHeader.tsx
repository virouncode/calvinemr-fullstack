import React from "react";
type LoginHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoginHeader = ({ setCreditsVisible }: LoginHeaderProps) => {
  return (
    <header>
      <div
        className="header header--login"
        onClick={() => setCreditsVisible((p) => !p)}
      >
        <div className="header__logo"></div>
        <h1 className="header__title">Electronic Medical Records</h1>
      </div>
    </header>
  );
};

export default LoginHeader;
