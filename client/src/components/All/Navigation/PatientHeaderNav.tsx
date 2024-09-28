import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";

const PatientHeaderNav = () => {
  const { user } = useUserContext() as { user: UserPatientType };
  return (
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
            to="/patient/pharmacies"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--patient header__link--active"
                : "header__link header__link--patient"
            }
          >
            Pharmacies
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
  );
};

export default PatientHeaderNav;
