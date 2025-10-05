import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZ } from "../../../utils/dates/formatDates";
import { toWelcomeName } from "../../../utils/names/toWelcomeName";

type SubheaderWelcomeProps = {
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const SubheaderWelcome = ({
  toastExpiredID,
  tokenLimitVerifierID,
}: SubheaderWelcomeProps) => {
  //Hooks
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const { socket, setSocket } = useSocketContext();
  const { setClinic } = useClinicContext();
  const { setAuth } = useAuthContext();
  const { staffInfos, setStaffInfos } = useStaffInfosContext();
  const { adminsInfos, setAdminsInfos } = useAdminsInfosContext();
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    const displayWelcome = () => {
      const now = nowTZ();
      const hour = now.hour;
      let message = "";
      if (hour >= 5 && hour < 12) {
        message = "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        message = "Good Afternoon";
      } else if (hour >= 17 && hour < 21) {
        message = "Good Evening";
      } else {
        message = "Good Night";
      }
      setWelcomeMessage(message);
    };
    displayWelcome();
    const intervalHello = setInterval(displayWelcome, 1800000);
    return () => {
      clearInterval(intervalHello);
    };
  }, []);

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
    <div className="subheader__right">
      <span style={{ marginRight: "5px" }}>
        {welcomeMessage} {toWelcomeName(user, staffInfos, adminsInfos)}
      </span>
      <strong className="subheader__right-logout" onClick={handleLogout}>
        (Logout)
      </strong>
    </div>
  );
};

export default SubheaderWelcome;
