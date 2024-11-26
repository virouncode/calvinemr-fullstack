import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import useAdminsInfosContext from "./context/useAdminsInfosContext";
import useAuthContext from "./context/useAuthContext";
import useClinicContext from "./context/useClinicContext";
import useSocketContext from "./context/useSocketContext";
import useStaffInfosContext from "./context/useStaffInfosContext";
import useUserContext from "./context/useUserContext";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuthContext();
  const { socket, setSocket } = useSocketContext();
  const { setUser } = useUserContext();
  const { setStaffInfos } = useStaffInfosContext();
  const { setAdminsInfos } = useAdminsInfosContext();
  const { setClinic } = useClinicContext();
  const navigate = useNavigate();

  const toastExpiredID = useRef<Id | null>(null);
  const tokenLimitVerifierID = useRef<number | null>(null);
  const handleLogout = useCallback(() => {
    setAuth(null);
    setUser(null);
    setStaffInfos([]);
    setAdminsInfos([]);
    setClinic(null);
    socket?.disconnect();
    setSocket(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("staffInfos");
    localStorage.removeItem("adminsInfos");
    localStorage.removeItem("clinic");
    localStorage.removeItem("lastAction");
    localStorage.removeItem("locked");
    localStorage.removeItem("currentNewClinicalNote");
    localStorage.removeItem("currentEditClinicalNote");
    localStorage.removeItem("alreadyWarnedSiteClosed");
    localStorage.setItem("message", "logout");
    tokenLimitVerifierID.current && clearInterval(tokenLimitVerifierID.current);
    toastExpiredID.current && toast.dismiss(toastExpiredID.current);
    navigate("/");
  }, [
    navigate,
    setAdminsInfos,
    setAuth,
    setClinic,
    setStaffInfos,
    setUser,
    socket,
    setSocket,
  ]);

  useEffect(() => {
    if (!auth?.tokenLimit) return;
    const tokenLimitVerifier = () => {
      if (
        Date.now() >= (auth?.tokenLimit as number) &&
        !toastExpiredID.current
      ) {
        toastExpiredID.current = toast.error(
          "Your user token has expired, please login again to refresh it",
          { containerId: "X", onClose: handleLogout }
        );
      }
    };
    tokenLimitVerifierID.current = window.setInterval(tokenLimitVerifier, 1000);
    return () => {
      if (tokenLimitVerifierID.current)
        clearInterval(tokenLimitVerifierID.current);
      toastExpiredID.current && toast.dismiss(toastExpiredID.current);
      toastExpiredID.current = null;
    };
  }, [auth?.tokenLimit, handleLogout]);

  return { tokenLimitVerifierID, toastExpiredID };
};

export default useRefreshToken;
