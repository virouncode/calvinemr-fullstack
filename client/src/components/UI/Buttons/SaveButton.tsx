import React from "react";

type SaveButtonProps = {
  label?: string;
  onClick: () => void;
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
      className="save-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default SaveButton;
