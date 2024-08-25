import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Id } from "react-toastify";
import UnlockForm from "../../components/All/Unlock/UnlockForm";

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
    <div>
      <HelmetProvider>
        <Helmet>
          <title>Calvin EMR: App locked</title>
        </Helmet>
      </HelmetProvider>
      <section className="lock-section">
        <UnlockForm
          setLockedScreen={setLockedScreen}
          toastExpiredID={toastExpiredID}
          tokenLimitVerifierID={tokenLimitVerifierID}
        />
      </section>
    </div>
  );
};

export default LockPage;
