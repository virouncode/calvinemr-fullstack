import React, { useEffect } from "react";
import logo from "../../../assets/img/logoRectTest.png";
import Button from "../Buttons/Button";

type ConfirmDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
  isPopUp: boolean;
  props: {
    title?: string;
    content?: string;
    yes: string;
    no: string;
  };
};

const ConfirmDialog = ({
  onConfirm,
  onCancel,
  isPopUp,
  props,
}: ConfirmDialogProps) => {
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
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [onConfirm]);
  return (
    <>
      <div
        style={{ height: `${document.body.clientHeight}px` }}
        className="confirm-container"
      >
        <div style={{ top: `${positionY}px` }} className="confirm-dialog">
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-header-logo">
              <img src={logo} alt="calvin-EMR-logo" />
            </div>
            <h2 style={{ fontSize: "1rem" }}>
              {props.title ?? "Confirmation"}
            </h2>
          </div>
          <p style={{ fontSize: "0.85rem", padding: "10px", margin: "0" }}>
            {props.content ?? "Do you really want to do this action ?"}
          </p>
          <p className="confirm-dialog-btn-container">
            <Button onClick={onConfirm} label={props.yes} />
            <Button onClick={onCancel} label={props.no} />
          </p>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
