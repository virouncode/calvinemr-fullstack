import React from "react";
import { AttachmentType } from "../../../types/api";

type SaveButtonProps = {
  label?: string;
  onClick:
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>)
    | ((
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => Promise<AttachmentType | undefined>);
  disabled?: boolean;
};
const SaveButton = ({
  label = "Save",
  onClick,
  disabled = false,
}: SaveButtonProps) => {
  return (
    <button
      type="button"
      className="btn save-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default SaveButton;
