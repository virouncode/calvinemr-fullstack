import React from "react";

type DeleteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const DeleteButton = ({ onClick, disabled = false }: DeleteButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      Delete
    </button>
  );
};

export default DeleteButton;
