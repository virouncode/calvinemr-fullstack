import { useEffect, useRef } from "react";
import { Id, toast } from "react-toastify";
import useAuthContext from "./context/useAuthContext";

const useRefreshToken = () => {
  const { auth } = useAuthContext();
  const toastExpiredID = useRef<Id | null>(null);
  const tokenLimitVerifierID = useRef<number | null>(null);

  useEffect(() => {
    if (!auth?.tokenLimit) return;
    const tokenLimitVerifier = () => {
      if (
        Date.now() >= (auth?.tokenLimit as number) &&
        !toastExpiredID.current
      ) {
        toastExpiredID.current = toast.error(
          "Your user token has expired, please login again to refresh it",
          { containerId: "X" }
        );
      }
    };
    tokenLimitVerifierID.current = setInterval(tokenLimitVerifier, 1000);
    return () => {
      if (tokenLimitVerifierID.current)
        clearInterval(tokenLimitVerifierID.current);
      toastExpiredID.current && toast.dismiss(toastExpiredID.current);
      toastExpiredID.current = null;
    };
  }, [auth?.tokenLimit]);

  return { tokenLimitVerifierID, toastExpiredID };
};

export default useRefreshToken;
