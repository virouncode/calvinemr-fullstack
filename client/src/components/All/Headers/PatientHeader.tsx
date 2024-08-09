import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";

type PatientHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PatientHeader = ({ setCreditsVisible }: PatientHeaderProps) => {
  const { user } = useUserContext() as { user: UserPatientType };
  return (
    <header className="header header--patient">
      <div
        className="header__logo"
        onClick={() => setCreditsVisible((p) => !p)}
      ></div>
      <nav className="header__nav header__nav--patient">
        <ul>
          <li>
            <NavLink
              to="/patient/messages"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
              }
            >
              {"Messages" + (user?.unreadNbr ? ` (${user?.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/appointments"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
              }
            >
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/pamphlets"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
              }
            >
              Pamphlets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patient/my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--patient header__link--active"
                  : "header__link header__link--patient"
              }
            >
              My Account
            </NavLink>
          </li>
        </ul>
      </nav>
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default PatientHeader;
