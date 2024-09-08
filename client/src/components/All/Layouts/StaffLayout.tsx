import React, { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Id } from "react-toastify";
import useTitleContext from "../../../hooks/context/useTitleContext";
import useAutoLockScreen from "../../../hooks/useAutoLockScreen";
import { useLocalStorageLock } from "../../../hooks/useLocalStorageLock";
import LockPage from "../../../pages/All/LockPage";
import Notepad from "../../Staff/Notepad/Notepad";
import ConfirmGlobal from "../../UI/Confirm/ConfirmGlobal";
import CreditsDialog from "../../UI/Confirm/CreditsDialog";
import ToastCalvin from "../../UI/Toast/ToastCalvin";
import ToastExpired from "../../UI/Toast/ToastExpired";
import ToastInactivity from "../../UI/Toast/ToastInactivity";
import FakeWindow from "../../UI/Windows/FakeWindow";
import StaffHeader from "../Headers/StaffHeader";
import StaffMobileNav from "../Navigation/StaffMobileNav";
import Subheader from "../Subheader/Subheader";

type StaffLayoutProps = {
  toastExpiredID: React.MutableRefObject<Id | null>;
  tokenLimitVerifierID: React.MutableRefObject<number | null>;
};

const StaffLayout = ({
  toastExpiredID,
  tokenLimitVerifierID,
}: StaffLayoutProps) => {
  //Hooks
  const { title } = useTitleContext();
  const [creditsVisible, setCreditsVisible] = useState(false);
  const [lockedScreen, setLockedScreen] = useState(false);
  const [notepadVisible, setNotepadVisible] = useState(false);
  useAutoLockScreen(setLockedScreen);
  useLocalStorageLock(setLockedScreen);

  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  const handleClickBars = () => {
    if (mobileNavRef.current) {
      mobileNavRef.current.classList.add("mobile-nav__container--active");
    }
  };
  const onConfirm = () => setCreditsVisible(false);

  return (
    <div className="wrapper container">
      <StaffMobileNav
        setNotepadVisible={setNotepadVisible}
        setLockedScreen={setLockedScreen}
        mobileNavRef={mobileNavRef}
      />

      <StaffHeader
        setCreditsVisible={setCreditsVisible}
        setLockedScreen={setLockedScreen}
        setNotepadVisible={setNotepadVisible}
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
