import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";
import ClipboardIcon from "../../UI/Icons/ClipboardIcon";
import LockIcon from "../../UI/Icons/LockIcon";
import QuestionIcon from "../../UI/Icons/QuestionIcon";

type StaffHeaderProps = {
  setCreditsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setNotepadVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const StaffHeader = ({
  setCreditsVisible,
  setLockedScreen,
  setNotepadVisible,
}: StaffHeaderProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };

  const handleLock = () => {
    setLockedScreen(true);
    localStorage.setItem("locked", "true");
    localStorage.setItem("message", "lock"); //send a message to all tabs to lock
    localStorage.removeItem("message");
  };
  const handleTutorial = () => {
    window.open(
      "https://www.youtube.com/watch?v=7yPuVKhl_vo&list=PL18a0lvAx8vrkIR9H_H53BR8KJ5lrAks4",
      "_blank"
    );
  };

  return (
    <header className="header">
      <div
        className="header__logo"
        onClick={() => setCreditsVisible((p) => !p)}
      ></div>
      <nav className="header__nav">
        <ul>
          <li>
            <NavLink
              to="/staff/calendar"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/search-patient"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Patients
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/groups"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Groups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/reports-inbox"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Inbox
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/messages"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/fax"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Fax
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/reference"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Reference
            </NavLink>
          </li>
          {user.title !== "Secretary" && (
            <li>
              <NavLink
                to="/staff/calvinai"
                className={(nav) =>
                  nav.isActive
                    ? "header__link header__link--active"
                    : "header__link"
                }
              >
                CalvinAI
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/staff/billing"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              Billings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/signup-patient"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              New Patient
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staff/my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--active"
                  : "header__link"
              }
            >
              My Account
            </NavLink>
          </li>
          <li>
            <Tooltip title="Notepad">
              <span>
                <ClipboardIcon
                  mr={15}
                  onClick={() => setNotepadVisible((v) => !v)}
                />
              </span>
            </Tooltip>
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
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default StaffHeader;
