import React from "react";

type DeleteButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
};

const DeleteButton = ({ onClick, disabled = false }: DeleteButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="btn">
      Delete
    </button>
  );
};

export default DeleteButton;
