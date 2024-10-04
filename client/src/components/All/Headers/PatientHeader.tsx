import logo from "@/assets/img/logoRectTest.png";
import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";
import BarsIcon from "../../UI/Icons/BarsIcon";
import PatientHeaderNav from "../Navigation/PatientHeaderNav";

type PatientHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleClickBars: () => void;
};

const PatientHeader = ({
  setCreditsVisible,
  handleClickBars,
}: PatientHeaderProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  return (
    <div className="header__container">
      <header className="header header--patient">
        <div
          className="header__logo"
          onClick={() => setCreditsVisible((p) => !p)}
        >
          <img src={logo} alt="CalvinEMR-logo" />
        </div>
        <div className="header__container">
          <PatientHeaderNav />
        </div>
        <div className="header__bars">
          <BarsIcon onClick={handleClickBars} />
        </div>
        <h1 className="header__title">Electronic Medical Records</h1>
      </header>
    </div>
  );
};

export default PatientHeader;
