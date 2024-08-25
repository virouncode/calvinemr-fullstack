import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Id } from "react-toastify";
import useTitleContext from "../../../hooks/context/useTitleContext";
import useAutoLockScreen from "../../../hooks/useAutoLockScreen";
import { useLocalStorageLock } from "../../../hooks/useLocalStorageLock";
import LockPage from "../../../pages/All/LockPage";
import ConfirmGlobal from "../../UI/Confirm/ConfirmGlobal";
import CreditsDialog from "../../UI/Confirm/CreditsDialog";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastExpired from "../../UI/Toast/ToastExpired";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import AdminHeader from "../Headers/AdminHeader";
import Subheader from "../Subheader/Subheader";

type AdminLayoutProps = {
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const AdminLayout = ({
  toastExpiredID,
  tokenLimitVerifierID,
}: AdminLayoutProps) => {
  //Hooks
  const { title } = useTitleContext();
  const [creditsVisible, setCreditsVisible] = useState(false);
  const [lockedScreen, setLockedScreen] = useState(false);
  useAutoLockScreen(setLockedScreen);
  useLocalStorageLock(setLockedScreen);

  const onConfirm = () => setCreditsVisible(false);

  return (
    <div className="wrapper">
      <AdminHeader
        setCreditsVisible={setCreditsVisible}
        setLockedScreen={setLockedScreen}
      />
      <Subheader
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
      {lockedScreen && (
        <LockPage
          setLockedScreen={setLockedScreen}
          tokenLimitVerifierID={tokenLimitVerifierID}
          toastExpiredID={toastExpiredID}
        />
      )}
    </div>
  );
};

export default AdminLayout;
