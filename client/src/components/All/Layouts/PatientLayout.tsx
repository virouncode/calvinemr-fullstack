import React, { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Id } from "react-toastify";
import useTitleContext from "../../../hooks/context/useTitleContext";
import ConfirmGlobal from "../../UI/Confirm/ConfirmGlobal";
import CreditsDialog from "../../UI/Confirm/CreditsDialog";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastExpired from "../../UI/Toast/ToastExpired";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import PatientHeader from "../Headers/PatientHeader";
import PatientMobileNav from "../Navigation/PatientMobileNav";
import Subheader from "../Subheader/Subheader";

type PatientLayoutProps = {
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const PatientLayout = ({
  toastExpiredID,
  tokenLimitVerifierID,
}: PatientLayoutProps) => {
  //Hooks
  const { title } = useTitleContext();
  const [creditsVisible, setCreditsVisible] = useState(false);
  const onConfirm = () => setCreditsVisible(false);

  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  const handleClickBars = () => {
    if (mobileNavRef.current) {
      mobileNavRef.current.classList.add("mobile-nav__container--active");
    }
  };
  return (
    <div className="wrapper container">
      <PatientMobileNav
        mobileNavRef={mobileNavRef}
        toastExpiredID={toastExpiredID}
        tokenLimitVerifierID={tokenLimitVerifierID}
      />
      <PatientHeader
        setCreditsVisible={setCreditsVisible}
        handleClickBars={handleClickBars}
      />
      <Subheader
        title={title}
        toastExpiredID={toastExpiredID}
        tokenLimitVerifierID={tokenLimitVerifierID}
      />
      <main className="main">
        {/* all the children of the Layout component */}
        <Outlet />
        <ConfirmGlobal />
        <ToastCalvin id="A" />
        <ToastInactivity id="Z" />
        <ToastExpired id="X" />
      </main>
      {creditsVisible && (
        <CreditsDialog
          onConfirm={onConfirm}
          isPopUp={false}
          props={{
            title: "Credits",
            content:
              "Version 1.0.0\nIssued 2024.07.01\nwww.calvinemr.com\n\n©TVK Investments",
            yes: "Close",
          }}
        />
      )}
    </div>
  );
};

export default PatientLayout;
