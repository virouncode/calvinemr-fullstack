import React from "react";

type UndoneButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

const UndoneButton = ({ onClick, disabled = false }: UndoneButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        marginLeft: "5px",
        fontSize: "0.7rem",
        boxShadow: "none",
      }}
    >
      Undone
    </button>
  );
};

export default UndoneButton;
