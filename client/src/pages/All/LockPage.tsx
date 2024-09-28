import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Id } from "react-toastify";
import LockForm from "../../components/All/Lock/LockForm";

type LockPageProps = {
  setLockedScreen: React.Dispatch<React.SetStateAction<boolean>>;
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const LockPage = ({
  setLockedScreen,
  toastExpiredID,
  tokenLimitVerifierID,
}: LockPageProps) => {
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const eraseHistory = () => {
      window.history.pushState(null, document.title, window.location.href);
    };
    window.addEventListener("popstate", eraseHistory);
    return () => {
      window.removeEventListener("popstate", eraseHistory);
    };
  }, []);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Calvin EMR: App locked</title>
        </Helmet>
      </HelmetProvider>
      <section className="lock">
        <LockForm
          setLockedScreen={setLockedScreen}
          toastExpiredID={toastExpiredID}
          tokenLimitVerifierID={tokenLimitVerifierID}
        />
      </section>
    </>
  );
};

export default LockPage;
