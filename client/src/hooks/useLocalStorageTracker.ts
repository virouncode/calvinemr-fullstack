import { useCallback, useEffect } from "react";

export const useLocalStorageTracker = () => {
  const handleTabClosing = useCallback(() => {
    const tabCounter = localStorage.getItem("tabCounter");

    if (tabCounter === "1") {
      localStorage.clear(); // Remove this if you want to keep the user logged in.
      // localStorage.removeItem("tabCounter");
    } else if (tabCounter) {
      // Ensure tabCounter is not null
      localStorage.setItem(
        "tabCounter",
        (parseInt(tabCounter) - 1).toString() // Decrement by 1
      );
    }
  }, []);

  useEffect(() => {
    const tabCounter = localStorage.getItem("tabCounter");

    if (!tabCounter || isNaN(parseInt(tabCounter))) {
      localStorage.setItem("tabCounter", "1");
    } else {
      localStorage.setItem("tabCounter", (parseInt(tabCounter) + 1).toString());
    }

    window.addEventListener("beforeunload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", handleTabClosing);
    };
  }, [handleTabClosing]);
};

export default useLocalStorageTracker;
