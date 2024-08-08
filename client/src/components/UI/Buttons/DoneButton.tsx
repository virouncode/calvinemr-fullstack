import React from "react";

type DoneButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const DoneButton = ({ onClick, disabled = false }: DoneButtonProps) => {
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
      Done
    </button>
  );
};

export default DoneButton;
