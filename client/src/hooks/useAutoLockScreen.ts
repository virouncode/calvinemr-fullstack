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

  const resetTimerWithStorageUpdate = useCallback(() => {
    stopTimer();
    startTimer();
    localStorage.setItem("lastAction", nowTZTimestamp().toString());
  }, [startTimer, stopTimer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    startTimer();
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

export default useAutoLockScreen;
