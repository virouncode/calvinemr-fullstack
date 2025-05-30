import React from "react";

type PrintButtonProps = {
  label?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
};

const PrintButton = ({
  label = "Print",
  onClick,
  disabled = false,
  className,
}: PrintButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} btn`}
    >
      {label}
    </button>
  );
};

export default PrintButton;
