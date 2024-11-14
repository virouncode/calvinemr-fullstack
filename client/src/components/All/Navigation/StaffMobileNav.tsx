import logo from "@/assets/img/logoRectTest.png";
import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";
import ClipboardIcon from "../../UI/Icons/ClipboardIcon";
import LockIcon from "../../UI/Icons/LockIcon";
import QuestionIcon from "../../UI/Icons/QuestionIcon";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";
import useSocketContext from "../../../hooks/context/useSocketContext";

type StaffMobileNavProps = {
  setNotepadVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileNavRef: React.MutableRefObject<HTMLDivElement | null>;
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const StaffMobileNav = ({
  setNotepadVisible,
  setLockedScreen,
  mobileNavRef,
  toastExpiredID,
  tokenLimitVerifierID,
}: StaffMobileNavProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket, setSocket } = useSocketContext();
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { setClinic } = useClinicContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();

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

  const handleLogout = () => {
    setAuth(null);
    setUser(null);
    setStaffInfos([]);
    setAdminsInfos([]);
    setClinic(null);
    socket?.disconnect();
    setSocket(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("locked");
    localStorage.removeItem("lastAction");
    localStorage.removeItem("currentNewClinicalNote");
    localStorage.removeItem("currentEditClinicalNote");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
    tokenLimitVerifierID.current && clearInterval(tokenLimitVerifierID.current);
    toastExpiredID.current && toast.dismiss(toastExpiredID.current);
    navigate("/");
  };

  return (
    <div className="mobile-nav__container container" ref={mobileNavRef}>
      <div className="mobile-nav__header">
        <div className="mobile-nav__logo">
          <img src={logo} alt="CalvinEMR-logo" />
        </div>
        <div className="mobile-nav__cross" onClick={handleClose}>
          <XmarkRectangleIcon size="2x" />
        </div>
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
              {"Fax" + (user.unreadFaxNbr ? ` (${user.unreadFaxNbr})` : "")}
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
          <li onClick={handleLogout}>
            <NavLink to="/" className="mobile-nav__link">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StaffMobileNav;
