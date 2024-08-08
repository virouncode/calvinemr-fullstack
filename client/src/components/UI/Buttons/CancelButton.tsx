import React from "react";

type CancelButtonProps = {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
};

const CancelButton = ({
  label = "Cancel",
  onClick,
  disabled = false,
}: CancelButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default CancelButton;
