import logo from "@/assets/img/logoRectTest.png";
import React from "react";
import BarsIcon from "../../UI/Icons/BarsIcon";
import StaffHeaderNav from "../Navigation/StaffHeaderNav";

type StaffHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotepadVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickBars: () => void;
};

const StaffHeader = ({
  setCreditsVisible,
  setLockedScreen,
  setNotepadVisible,
  handleClickBars,
}: StaffHeaderProps) => {
  //Hooks

  return (
    <header className="header">
      <div
        className="header__logo"
        onClick={() => setCreditsVisible((p) => !p)}
      >
        <img src={logo} alt="CalvinEMR-logo" />
      </div>

      <StaffHeaderNav
        setLockedScreen={setLockedScreen}
        setNotepadVisible={setNotepadVisible}
      />

      <div className="header__bars">
        <BarsIcon onClick={handleClickBars} />
      </div>
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default StaffHeader;
