import React from "react";

type EditButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

const EditButton = ({ onClick, disabled = false }: EditButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      Edit
    </button>
  );
};

export default EditButton;
