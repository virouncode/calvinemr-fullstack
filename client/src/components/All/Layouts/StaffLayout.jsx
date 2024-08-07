import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useTitleContext from "../../../hooks/context/useTitleContext";
import useAutoLockScreen from "../../../hooks/useAutoLockScreen";
import LockPage from "../../../pages/All/LockPage";
import Notepad from "../../Staff/Notepad/Notepad";
import ConfirmGlobal from "../../UI/Confirm/ConfirmGlobal";
import CreditsDialog from "../../UI/Confirm/CreditsDialog";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastExpired from "../../UI/Toast/ToastExpired";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import FakeWindow from "../../UI/Windows/FakeWindow";
import StaffHeader from "../Headers/StaffHeader";
import Subheader from "../Subheader/Subheader";

const StaffLayout = ({ toastExpiredID, tokenLimitVerifierID }) => {
  const { title } = useTitleContext();
  const onConfirm = () => setCreditsVisible(false);
  const [creditsVisible, setCreditsVisible] = useState(false);
  const [lockedScreen, setLockedScreen] = useState(false);
  const [notepadVisible, setNotepadVisible] = useState(false);
  useAutoLockScreen(setLockedScreen);
  const handleStorageEvent = useCallback((e) => {
    if (e.key !== "message") return;
    const message = e.newValue;
    if (!message) return;
    if (message === "lock") {
      //clean context
      setLockedScreen(true);
    }
    if (message === "unlock") {
      setLockedScreen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", handleStorageEvent);
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [handleStorageEvent]);
  useEffect(() => {
    if (localStorage.getItem("locked") === "true") setLockedScreen(true);
  }, []);

  return (
    <div className="wrapper">
      <StaffHeader
        setCreditsVisible={setCreditsVisible}
        setLockedScreen={setLockedScreen}
        setNotepadVisible={setNotepadVisible}
      />
      <Subheader
        title={title}
        toastExpiredID={toastExpiredID}
        tokenLimitVerifierID={tokenLimitVerifierID}
      />
      <main>
        {/* all the children of the Layout component */}
        <Outlet />
        {/********************************************/}
        <ConfirmGlobal />
        <ToastCalvin id="A" />
        <ToastInactivity id="Z" />
        <ToastExpired id="X" />
        {/******* toast system *****************/}
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
      {notepadVisible && (
        <FakeWindow
          title="NOTEPAD"
          width={600}
          height={800}
          x={0}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setNotepadVisible}
          closeCross={false}
        >
          <Notepad setNotepadVisible={setNotepadVisible} />
        </FakeWindow>
      )}
    </div>
  );
};

export default StaffLayout;
