import { useCallback, useEffect } from "react";

export const useLocalStorageLock = (
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleStorageEvent = useCallback(
    (e: StorageEvent) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "lock") {
        //clean context
        setLockedScreen(true);
      }
      if (message === "unlock") {
        setLockedScreen(false);
      }
    },
    [setLockedScreen]
  );
  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [handleStorageEvent]);
  useEffect(() => {
    if (localStorage.getItem("locked") === "true") setLockedScreen(true);
  }, [setLockedScreen]);
};
