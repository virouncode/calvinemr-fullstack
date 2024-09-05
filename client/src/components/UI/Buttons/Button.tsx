import React from "react";
import { AttachmentType } from "../../../types/api";
type ButtonProps = {
  label: string;
  onClick:
    | ((
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => void | Promise<void>)
    | ((
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => Promise<AttachmentType | undefined>);

  disabled?: boolean;
  className?: string;
};

const Button = ({
  label,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) => {
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

export default Button;
