import { useCallback, useEffect, useRef } from "react";
import { nowTZTimestamp } from "../utils/dates/formatDates";
import useUserContext from "./context/useUserContext";

const useAutoLockScreen = (setLockedScreen) => {
  const { user } = useUserContext();
  const timeMin =
    user.access_level === "admin"
      ? user.autolock_time_min
      : user.settings.autolock_time_min;
  let logoutTimerID = useRef(null);

  const lockScreen = useCallback(() => {
    setLockedScreen(true);
  }, [setLockedScreen]);

  const startTimer = useCallback(() => {
    logoutTimerID.current = window.setTimeout(lockScreen, timeMin * 60 * 1000);
  }, [lockScreen, timeMin]);

  const stopTimer = useCallback(() => {
    window.clearTimeout(logoutTimerID.current);
    logoutTimerID.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    startTimer();
    localStorage.setItem("lastAction", nowTZTimestamp());
  }, [startTimer, stopTimer]);

  const handleStorageEvent = useCallback(
    (e) => {
      if (e.key === "lastAction") {
        resetTimer();
      }
    },
    [resetTimer]
  );

  useEffect(() => {
    startTimer();
    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("DOMMouseScroll", resetTimer);
    window.addEventListener("mousewheel", resetTimer);
    window.addEventListener("touchmove", resetTimer);
    window.addEventListener("MSPointerMove", resetTimer);
    return () => {
      stopTimer();
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("DOMMouseScroll", resetTimer);
      window.removeEventListener("mousewheel", resetTimer);
      window.removeEventListener("touchmove", resetTimer);
      window.removeEventListener("MSPointerMove", resetTimer);
    };
  }, [handleStorageEvent, resetTimer, startTimer, stopTimer]);
};

export default useAutoLockScreen;
