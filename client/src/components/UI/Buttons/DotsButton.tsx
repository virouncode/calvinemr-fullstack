import React from "react";

type DotsButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
};

const DotsButton = ({ onClick, className }: DotsButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={`${className} btn`}>
      ...
    </button>
  );
};

export default DotsButton;
