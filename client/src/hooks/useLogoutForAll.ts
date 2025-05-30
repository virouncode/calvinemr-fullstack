//If one tab logs out, logout all the tables
//Listen to local storage events, if the key is "message" and the valu is "logout" => logout
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminsInfosContext from "./context/useAdminsInfosContext";
import useAuthContext from "./context/useAuthContext";
import useClinicContext from "./context/useClinicContext";
import useSocketContext from "./context/useSocketContext";
import useStaffInfosContext from "./context/useStaffInfosContext";
import useUserContext from "./context/useUserContext";

const useLogoutForAll = () => {
  const { socket, setSocket } = useSocketContext();
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAuth } = useAuthContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const navigate = useNavigate();
  const handleStorageEvent = useCallback(
    (e: StorageEvent) => {
      if (e.key !== "message") return;
      const message = e.newValue;
      if (!message) return;
      if (message === "logout") {
        //clean context
        setUser(null);
        setAuth(null);
        setStaffInfos([]);
        setAdminsInfos([]);
        setClinic(null);
        navigate("/");
        socket?.disconnect();
        setSocket(null);
      }
    },
    [
      navigate,
      setAdminsInfos,
      setAuth,
      setClinic,
      setStaffInfos,
      setUser,
      socket,
      setSocket,
    ]
  );
  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [handleStorageEvent]);
};

export default useLogoutForAll;
