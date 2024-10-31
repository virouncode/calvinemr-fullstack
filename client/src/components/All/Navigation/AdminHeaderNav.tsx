import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import LockIcon from "../../UI/Icons/LockIcon";
import QuestionIcon from "../../UI/Icons/QuestionIcon";

type AdminHeaderNavProps = {
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminHeaderNav = ({ setLockedScreen }: AdminHeaderNavProps) => {
  const handleLock = () => {
    setLockedScreen(true);
  };
  const handleTutorial = () => {
    window.open(
      "https://www.youtube.com/watch?v=7yPuVKhl_vo&list=PL18a0lvAx8vrkIR9H_H53BR8KJ5lrAks4",
      "_blank"
    );
  };
  return (
    <nav className="header__nav header__nav--admin">
      <ul>
        <li>
          <NavLink
            to="/admin/dashboard"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/staff-accounts"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Staff Accounts
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/patients-accounts"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Patients Accounts
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/clinic"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Clinic infos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/billing"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Billings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/migration"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Migration
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/logs"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            Logs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/my-account"
            className={(nav) =>
              nav.isActive
                ? "header__link header__link--admin header__link--active"
                : "header__link header__link--admin"
            }
          >
            My Account
          </NavLink>
        </li>
        <li>
          <Tooltip title="Lock Screen">
            <span>
              <LockIcon mr={15} onClick={handleLock} />
            </span>
          </Tooltip>
          <Tooltip title="Tutorial">
            <span>
              <QuestionIcon onClick={handleTutorial} />
            </span>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
};

export default AdminHeaderNav;
