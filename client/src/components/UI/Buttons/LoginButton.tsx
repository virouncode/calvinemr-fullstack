import React from "react";
import CircularProgressSmallBlack from "../Progress/CircularProgressSmallBlack";

type LoginButtonProps = {
  label: string;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
};

const LoginButton = ({
  label,
  onClick,
  disabled = false,
  loading,
}: LoginButtonProps) => {
  return (
    <button
      type="button"
      className="login-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <CircularProgressSmallBlack /> : label}
    </button>
  );
};

export default LoginButton;
