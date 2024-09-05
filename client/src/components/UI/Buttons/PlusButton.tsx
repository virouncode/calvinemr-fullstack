import React from "react";

type PlusButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
};
const PlusButton = ({ onClick, className }: PlusButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={`${className} btn`}>
      +
    </button>
  );
};

export default PlusButton;
