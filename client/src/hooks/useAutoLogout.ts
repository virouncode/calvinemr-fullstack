import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import { nowTZTimestamp } from "../utils/dates/formatDates";
import useAdminsInfosContext from "./context/useAdminsInfosContext";
import useAuthContext from "./context/useAuthContext";
import useClinicContext from "./context/useClinicContext";
import useSocketContext from "./context/useSocketContext";
import useStaffInfosContext from "./context/useStaffInfosContext";
import useUserContext from "./context/useUserContext";

const useAutoLogout = (
  timeMin: number,
  toastExpiredID: React.MutableRefObject<Id | null>,
  tokenLimitVerifierID: React.MutableRefObject<number | null>
) => {
  const { socket, setSocket } = useSocketContext();
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAuth } = useAuthContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const navigate = useNavigate();
  const logoutTimerID = useRef<number | null>(null);
  const toastTimerID = useRef<number | null>(null);
  const toastID = useRef<Id | null>(null);
  const timeLeft = useRef(timeMin * 60);

  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("lastAction");
    localStorage.removeItem("locked");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("currentNewClinicalNote");
    localStorage.removeItem("currentEditClinicalNote");
    localStorage.removeItem("alreadyWarnedSiteClosed");
    localStorage.setItem("message", "logout"); //send a message to all tabs to logout
    localStorage.removeItem("message");
    toastID.current && toast.dismiss(toastID.current);
    toastExpiredID.current && toast.dismiss(toastExpiredID.current);
    tokenLimitVerifierID.current && clearInterval(tokenLimitVerifierID.current);
    timeLeft.current = timeMin * 60;
    setUser(null);
    setAuth(null);
    setStaffInfos([]);
    setAdminsInfos([]);
    setClinic(null);
    navigate("/");
    socket?.disconnect();
    setSocket(null);
  }, [
    navigate,
    setAdminsInfos,
    setAuth,
    setClinic,
    setStaffInfos,
    setUser,
    timeMin,
    toastExpiredID,
    tokenLimitVerifierID,
    socket,
    setSocket,
  ]);

  const startTimer = useCallback(() => {
    logoutTimerID.current = window.setTimeout(logout, timeMin * 60 * 1000);
    toastTimerID.current = window.setInterval(() => {
      timeLeft.current -= 1;
      if (timeLeft.current === 60) {
        toastID.current = toast.info(
          `Due to inactivity, you will be disconnected in 60 s`,
          { containerId: "Z" }
        );
      } else if (timeLeft.current < 60 && toastID.current) {
        const message = `Due to inactivity, you will be disconnected in ${timeLeft.current} s`;
        toast.update(toastID.current, {
          containerId: "Z",
          render: message,
          type: "info",
          progress: timeLeft.current / 60,
        });
      }
    }, 1000);
  }, [logout, timeLeft, timeMin]);

  const stopTimer = useCallback(() => {
    if (logoutTimerID.current !== null) {
      window.clearTimeout(logoutTimerID.current);
    }
    if (toastTimerID.current !== null) {
      window.clearInterval(toastTimerID.current);
    }
    logoutTimerID.current = null;
    toastTimerID.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    timeLeft.current = timeMin * 60;
    toastID.current && toast.dismiss(toastID.current);
    startTimer();
  }, [stopTimer, timeMin, startTimer]);

  const resetTimerWithStorageUpdate = useCallback(() => {
    stopTimer();
    timeLeft.current = timeMin * 60;
    toastID.current && toast.dismiss(toastID.current);
    startTimer();
    const newTimestamp = nowTZTimestamp();
    localStorage.setItem("lastAction", newTimestamp.toString());
  }, [stopTimer, timeMin, startTimer]);

  const handleStorageEvent = useCallback(
    (e: StorageEvent) => {
      if (e.key === "lastAction") {
        resetTimer();
      }
    },
    [resetTimer]
  );

  useEffect(() => {
    startTimer();
    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("mousemove", resetTimerWithStorageUpdate);
    window.addEventListener("mousedown", resetTimerWithStorageUpdate);
    window.addEventListener("keypress", resetTimerWithStorageUpdate);
    window.addEventListener("DOMMouseScroll", resetTimerWithStorageUpdate, {
      passive: true,
    });
    window.addEventListener("mousewheel", resetTimerWithStorageUpdate, {
      passive: true,
    });
    window.addEventListener("touchmove", resetTimerWithStorageUpdate, {
      passive: true,
    });
    window.addEventListener("MSPointerMove", resetTimerWithStorageUpdate, {
      passive: true,
    });
    return () => {
      stopTimer();
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("mousemove", resetTimerWithStorageUpdate);
      window.removeEventListener("mousedown", resetTimerWithStorageUpdate);
      window.removeEventListener("keypress", resetTimerWithStorageUpdate);
      window.removeEventListener("DOMMouseScroll", resetTimerWithStorageUpdate);
      window.removeEventListener("mousewheel", resetTimerWithStorageUpdate);
      window.removeEventListener("touchmove", resetTimerWithStorageUpdate);
      window.removeEventListener("MSPointerMove", resetTimerWithStorageUpdate);
    };
  }, [
    handleStorageEvent,
    resetTimer,
    resetTimerWithStorageUpdate,
    startTimer,
    stopTimer,
  ]);
};

export default useAutoLogout;
