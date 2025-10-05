import logo from "@/assets/img/logoRectTest.png";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";

type PatientMobileNavProps = {
  mobileNavRef: React.MutableRefObject<HTMLDivElement | null>;
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const PatientMobileNav = ({
  mobileNavRef,
  toastExpiredID,
  tokenLimitVerifierID,
}: PatientMobileNavProps) => {
  const { user } = useUserContext() as { user: UserPatientType };
  const { socket, setSocket } = useSocketContext();
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { setClinic } = useClinicContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();

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
    localStorage.removeItem("calendarScrollPosition");
    localStorage.removeItem("calendarCurrentDate");
    localStorage.removeItem("alreadyWarnedSiteClosed");
    localStorage.removeItem("purposes");
    localStorage.removeItem("purposesCategories");
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
            <NavLink to="/patient/messages" className="mobile-nav__link">
              {"Messages" + (user?.unreadNbr ? ` (${user?.unreadNbr})` : "")}
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/patient/appointments" className="mobile-nav__link">
              Appointments
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/patient/pamphlets" className="mobile-nav__link">
              Pamphlets
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/patient/pharmacies" className="mobile-nav__link">
              Pharmacies
            </NavLink>
          </li>
          <li onClick={handleClose}>
            <NavLink to="/patient/my-account" className="mobile-nav__link">
              My Account
            </NavLink>
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

export default PatientMobileNav;
