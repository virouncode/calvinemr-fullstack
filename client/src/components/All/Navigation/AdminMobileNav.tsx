import logo from "@/assets/img/logoRectTest.png";
import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserAdminType } from "../../../types/app";
import LockIcon from "../../UI/Icons/LockIcon";
import QuestionIcon from "../../UI/Icons/QuestionIcon";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";

type AdminMobileNavProps = {
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileNavRef: React.MutableRefObject<HTMLDivElement | null>;
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const AdminMobileNav = ({
  setLockedScreen,
  mobileNavRef,
  toastExpiredID,
  tokenLimitVerifierID,
}: AdminMobileNavProps) => {
  const { user } = useUserContext() as { user: UserAdminType };
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
    localStorage.removeItem("alreadyWarnedSiteClosed");
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
            <NavLink to="/admin/dashboard" className="mobile-nav__link">
              Dashboard
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/staff-accounts" className="mobile-nav__link">
              Staff Accounts
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/patients-accounts" className="mobile-nav__link">
              Patients Accounts
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/clinic" className="mobile-nav__link">
              Clinic infos
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/billing" className="mobile-nav__link">
              Billings
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/migration" className="mobile-nav__link">
              Migration
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/logs" className="mobile-nav__link">
              Logs
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/admin/my-account" className="mobile-nav__link">
              My Account
            </NavLink>
          </li>
          <li onClick={handleClose}>
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

export default AdminMobileNav;
