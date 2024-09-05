import React from "react";

type CloseButtonProps = {
  label?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};
const CloseButton = ({
  label = "Close",
  onClick,
  disabled = false,
}: CloseButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn">
      {label}
    </button>
  );
};

export default CloseButton;
