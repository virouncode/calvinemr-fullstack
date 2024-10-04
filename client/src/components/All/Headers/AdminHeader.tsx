import logo from "@/assets/img/logoRectTest.png";
import React from "react";
import BarsIcon from "../../UI/Icons/BarsIcon";
import AdminHeaderNav from "../Navigation/AdminHeaderNav";

type AdminHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickBars: () => void;
};

const AdminHeader = ({
  setCreditsVisible,
  setLockedScreen,
  handleClickBars,
}: AdminHeaderProps) => {
  return (
    <div className="header__container">
      <header className="header">
        <div
          className="header__logo"
          onClick={() => setCreditsVisible((p) => !p)}
        >
          <img src={logo} alt="CalvinEMR-logo" />
        </div>
        <AdminHeaderNav setLockedScreen={setLockedScreen} />
        <div className="header__bars">
          <BarsIcon onClick={handleClickBars} />
        </div>
        <h1 className="header__title">Electronic Medical Records</h1>
      </header>
    </div>
  );
};

export default AdminHeader;
