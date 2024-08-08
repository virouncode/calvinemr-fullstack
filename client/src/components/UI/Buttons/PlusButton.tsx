import React from "react";

type PlusButtonProps = {
  onClick: () => void;
  className?: string;
};
const PlusButton = ({ onClick, className }: PlusButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      +
    </button>
  );
};

export default PlusButton;
