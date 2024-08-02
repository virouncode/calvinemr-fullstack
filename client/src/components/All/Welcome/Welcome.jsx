import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowHumanTZ, nowTZ } from "../../../utils/dates/formatDates";
import { toWelcomeName } from "../../../utils/names/toWelcomeName";

const Welcome = ({ title, toastExpiredID, tokenLimitVerifierID }) => {
  //=================== STATES =======================//
  const [helloMessage, setHelloMessage] = useState("");
  const [clock, setClock] = useState("");
  const { user, setUser } = useUserContext();
  const { clinic, setClinic } = useClinicContext();
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

    const displayClock = () => {
      setClock(nowHumanTZ());
    };
    displayHello();
    displayClock();
    const intervalHello = setInterval(displayHello, 1800000);
    const intervalClock = setInterval(displayClock, 1000);

    return () => {
      clearInterval(intervalHello);
      clearInterval(intervalClock);
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
    user.id && (
      <section className="welcome-section">
        <h2 className="welcome-section__clinic">
          {clinic.name}, {clock}
        </h2>
        <h2 className="welcome-section__title">
          {title}{" "}
          {title === "Calvin AI Chat" && (
            <sup style={{ fontSize: "0.5rem" }}>Powered by ChatGPT</sup>
          )}
        </h2>
        <p className="welcome-section__message">
          {helloMessage} {toWelcomeName(user, staffInfos, adminsInfos)}
          {"   "}
          <strong
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={handleLogout}
          >
            (Logout)
          </strong>
        </p>
      </section>
    )
  );
};

export default Welcome;
