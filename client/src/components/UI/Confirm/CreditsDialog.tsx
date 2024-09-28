import React, { useEffect } from "react";
import logo from "../../../assets/img/logoRectTest.png";
import Button from "../Buttons/Button";

type CreditsDialogProps = {
  onConfirm: () => void;
  isPopUp: boolean;
  props: {
    title: string;
    content: string;
    yes: string;
  };
};
const CreditsDialog = ({ onConfirm, isPopUp, props }: CreditsDialogProps) => {
  const positionY = isPopUp
    ? window.innerHeight / 2 - 70
    : window.innerHeight / 2 + window.scrollY;

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [onConfirm]);
  return (
    <>
      <div
        style={{ height: `${document.body.clientHeight}px` }}
        className="confirm-container"
      >
        <div
          style={{ top: `${positionY}px` }}
          className="confirm-dialog confirm-dialog--credits"
        >
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-header-logo">
              <img src={logo} alt="calvin-EMR-logo" />
            </div>
            <h2 style={{ fontSize: "1rem" }}>
              {props.title || "Confirmation"}
            </h2>
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              padding: "10px",
              margin: "0",
              whiteSpace: "pre-wrap",
              textAlign: "center",
            }}
          >
            <p>{props.content ?? "Do you really want to do this action ?"}</p>
          </div>
          <p className="confirm-dialog-btn-container">
            <Button onClick={onConfirm} label={props.yes} />
          </p>
        </div>
      </div>
    </>
  );
};

export default CreditsDialog;
