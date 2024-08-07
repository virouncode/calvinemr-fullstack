import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZ } from "../../../utils/dates/formatDates";
import { toWelcomeName } from "../../../utils/names/toWelcomeName";

const SubheaderWelcome = ({ toastExpiredID, tokenLimitVerifierID }) => {
  const [helloMessage, setHelloMessage] = useState("");
  const { user, setUser } = useUserContext();
  const { setClinic } = useClinicContext();
  const { setAuth } = useAuthContext();
  const { staffInfos, setStaffInfos } = useStaffInfosContext();
  const { adminsInfos, setAdminsInfos } = useAdminsInfosContext();
  const navigate = useNavigate();

  useEffect(() => {
    const displayHello = () => {
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
      setHelloMessage(message);
    };
    displayHello();
    const intervalHello = setInterval(displayHello, 1800000);
    return () => {
      clearInterval(intervalHello);
    };
  }, []);

  const handleLogout = () => {
    setAuth({});
    setUser({});
    setStaffInfos({});
    setAdminsInfos({});
    setClinic({});
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
    clearInterval(tokenLimitVerifierID.current);
    toastExpiredID.current && toast.dismiss(toastExpiredID.current);
    navigate("/");
  };
  return (
    <div className="subheader-section__right">
      <span style={{ marginRight: "10px" }}>
        {helloMessage} {toWelcomeName(user, staffInfos, adminsInfos)}
      </span>
      <strong
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={handleLogout}
      >
        (Logout)
      </strong>
    </div>
  );
};

export default SubheaderWelcome;
