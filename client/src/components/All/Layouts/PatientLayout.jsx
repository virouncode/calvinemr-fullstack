import { useState } from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../hooks/context/useTitleContext";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastExpired from "../../UI/Toast/ToastExpired";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import ConfirmGlobal from "../Confirm/ConfirmGlobal";
import CreditsDialog from "../Confirm/CreditsDialog";
import PatientHeader from "../Headers/PatientHeader";
import Welcome from "../Welcome/Welcome";

const PatientLayout = ({ toastExpiredID, tokenLimitVerifierID }) => {
  const { title } = useTitleContext();
  const onConfirm = () => setCreditsVisible(false);
  const [creditsVisible, setCreditsVisible] = useState(false);
  return (
    <div className="wrapper">
      <PatientHeader setCreditsVisible={setCreditsVisible} />
      <Welcome
        title={title}
        toastExpiredID={toastExpiredID}
        tokenLimitVerifierID={tokenLimitVerifierID}
      />
      <main>
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
