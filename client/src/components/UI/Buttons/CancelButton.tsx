import React from "react";

type CancelButtonProps = {
  label?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

const CancelButton = ({
  label = "Cancel",
  onClick,
  disabled = false,
}: CancelButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn">
      {label}
    </button>
  );
};

export default CancelButton;
