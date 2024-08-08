import React from "react";

type CloseButtonProps = {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
};
const CloseButton = ({
  label = "Close",
  onClick,
  disabled = false,
}: CloseButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default CloseButton;
