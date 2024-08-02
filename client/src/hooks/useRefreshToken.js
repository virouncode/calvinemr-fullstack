import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useAuthContext from "./context/useAuthContext";

const useRefreshToken = () => {
  const { auth } = useAuthContext();
  const toastExpiredID = useRef(null);
  const tokenLimitVerifierID = useRef(null);

  useEffect(() => {
    if (!auth.tokenLimit) return;
    const tokenLimitVerifier = () => {
      if (Date.now() >= auth.tokenLimit && !toastExpiredID.current) {
        toastExpiredID.current = toast.error(
          "Your user token has expired, please login again to refresh it",
          { containerId: "X" }
        );
      }
    };
    tokenLimitVerifierID.current = setInterval(tokenLimitVerifier, 1000);
    return () => {
      clearInterval(tokenLimitVerifierID.current);
      toastExpiredID.current && toast.dismiss(toastExpiredID.current);
      toastExpiredID.current = null;
    };
  }, [auth.tokenLimit]);

  return { tokenLimitVerifierID, toastExpiredID };
};

export default useRefreshToken;
