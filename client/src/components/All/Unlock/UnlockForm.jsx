import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useAuthContext from "../../../hooks/context/useAuthContext";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";

axios.defaults.withCredentials = true;

const UnlockForm = ({
  setLockedScreen,
  toastExpiredID,
  tokenLimitVerifierID,
}) => {
  const { user, setUser } = useUserContext();
  const { socket } = useSocketContext();
  const { setAuth } = useAuthContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const [errMsg, setErrMsg] = useState("");
  const [autolockTime, setAutoLockTime] = useState(
    user.access_level === "admin"
      ? user.autolock_time_min.toString()
      : user.settings.autolock_time_min.toString()
  );
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const handleChange = (e) => {
    setErrMsg("");
    setPin(e.target.value);
  };
  const handleAutoLockChange = (e) => {
    setAutoLockTime(e.target.value);
  };
  const handleSubmit = useCallback(async () => {
    try {
      const response = await axios.post(`/api/xano/unlock`, {
        pin: parseInt(pin),
        user_id: user.id,
        userType: user.access_level,
      });
      if (response.data) {
        setLockedScreen(false);
        localStorage.setItem("locked", "false");
        localStorage.setItem("message", "unlock"); //send a message to all tabs to unlock
        localStorage.removeItem("message");

        if (
          user.access_level === "admin" &&
          autolockTime !== user.autolock_time_min.toString()
        ) {
          const userToPut = {
            ...user,
            autolock_time_min: parseInt(autolockTime),
          };
          const response = await xanoPut(
            `/admin/${user.id}`,
            "admin",
            userToPut
          );
          socket.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: response,
            },
          });
          socket.emit("message", {
            route: "ADMINS INFOS",
            action: "update",
            content: {
              id: user.id,
              data: response,
            },
          });
          toast.success("Saved auto lock time preference", {
            containerId: "A",
          });
        } else if (
          user.access_level !== "admin" &&
          autolockTime !== user.settings.autolock_time_min.toString()
        ) {
          const settingsToPut = {
            ...user.settings,
            autolock_time_min: parseInt(autolockTime),
          };
          const response = await xanoPut(
            `/settings/${user.settings.id}`,
            "staff",
            settingsToPut
          );
          socket.emit("message", {
            route: "USER",
            action: "update",
            content: {
              id: user.id,
              data: {
                ...user,
                settings: response,
              },
            },
          });
          toast.success("Saved auto lock time preference", {
            containerId: "A",
          });
        }
      } else {
        throw new Error("Invalid PIN");
      }
    } catch (err) {
      setErrMsg(err.message);
    }
  }, [autolockTime, pin, setLockedScreen, socket, user]);

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
    localStorage.removeItem("lastAction");
    localStorage.removeItem("locked");
    localStorage.removeItem("currentNewClinicalNote");
    localStorage.removeItem("currentEditClinicalNote");
    localStorage.setItem("message", "logout");
    localStorage.removeItem("message");
    clearInterval(tokenLimitVerifierID.current);
    toastExpiredID.current && toast.dismiss(toastExpiredID.current);
    navigate("/");
  };

  useEffect(() => {
    const handleEnterShortcut = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleEnterShortcut);
    return () => {
      window.removeEventListener("keydown", handleEnterShortcut);
    };
  }, [handleSubmit]);

  return (
    <div className="unlock-form">
      <div className="unlock-form__message">
        This session was locked by <strong>{user.full_name}</strong>
        <br />
        <br />
        Please enter PIN to unlock:
      </div>
      {errMsg && <div className="unlock-form__err">{errMsg}</div>}
      <div className="unlock-form__input">
        <input
          type="password"
          placeholder="PIN 4-digits"
          autoFocus
          autoComplete="off"
          value={pin}
          onChange={handleChange}
        />
        <button
          className="save-btn"
          onClick={handleSubmit}
          style={{ marginRight: "5px" }}
        >
          Unlock
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="unlock-form__message" style={{ marginTop: "20px" }}>
        <label style={{ marginRight: "10px" }}>Change auto lock time:</label>
        <select value={autolockTime} onChange={handleAutoLockChange}>
          <option value="1">1 min</option>
          <option value="5">5 min</option>
          <option value="10">10 min</option>
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="60">1 hour</option>
        </select>
      </div>
    </div>
  );
};

export default UnlockForm;
