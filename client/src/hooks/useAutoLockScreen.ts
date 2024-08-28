import { useCallback, useEffect, useRef } from "react";
import { AdminType } from "../types/api";
import { UserStaffType } from "../types/app";
import { nowTZTimestamp } from "../utils/dates/formatDates";
import useUserContext from "./context/useUserContext";

const useAutoLockScreen = (
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const timeMin =
    user.access_level === "admin"
      ? (user as AdminType)?.autolock_time_min
      : (user as UserStaffType)?.settings?.autolock_time_min || 0;
  const logoutTimerID = useRef<number | null>(null);

  const lockScreen = useCallback(() => {
    setLockedScreen(true);
  }, [setLockedScreen]);

  const startTimer = useCallback(() => {
    logoutTimerID.current = window.setTimeout(lockScreen, timeMin * 60 * 1000);
  }, [lockScreen, timeMin]);

  const stopTimer = useCallback(() => {
    if (logoutTimerID.current) window.clearTimeout(logoutTimerID.current);
    logoutTimerID.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    startTimer();
    localStorage.setItem("lastAction", nowTZTimestamp().toString());
  }, [startTimer, stopTimer]);

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
