import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";
import ClipboardIcon from "../../UI/Icons/ClipboardIcon";
import LockIcon from "../../UI/Icons/LockIcon";
import QuestionIcon from "../../UI/Icons/QuestionIcon";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";

type StaffMobileNavProps = {
  setNotepadVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileNavRef: React.MutableRefObject<HTMLDivElement | null>;
};

const StaffMobileNav = ({
  setNotepadVisible,
  setLockedScreen,
  mobileNavRef,
}: StaffMobileNavProps) => {
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

  const handleClose = () => {
    if (mobileNavRef.current)
      mobileNavRef.current.classList.remove("mobile-nav__container--active");
  };

  return (
    <div className="mobile-nav__container container" ref={mobileNavRef}>
      <div className="mobile-nav__cross" onClick={handleClose}>
        <XmarkRectangleIcon size="2x" />
      </div>
      <nav className="mobile-nav">
        <ul>
          <li onClick={handleClose}>
            <NavLink to="/staff/calendar" className="mobile-nav__link">
              Calendar
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/search-patient" className="mobile-nav__link">
              Patients
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/groups" className="mobile-nav__link">
              Groups
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/reports-inbox" className="mobile-nav__link">
              Inbox
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/messages" className="mobile-nav__link">
              {"Messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/fax" className="mobile-nav__link">
              Fax
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/reference" className="mobile-nav__link">
              Reference
            </NavLink>
          </li>
          {user.title !== "Secretary" && (
            <li onClick={handleClose}>
              <NavLink to="/staff/calvinai" className="mobile-nav__link">
                CalvinAI
              </NavLink>
            </li>
          )}
          <li onClick={handleClose}>
            <NavLink to="/staff/billing" className="mobile-nav__link">
              Billings
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/signup-patient" className="mobile-nav__link">
              New Patient
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/staff/my-account" className="mobile-nav__link">
              My Account
            </NavLink>
          </li>
          <li onClick={handleClose}>
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
    </div>
  );
};

export default StaffMobileNav;
