import React from "react";

type LinkButtonProps = {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  url: string;
};

const LinkButton = ({
  label,
  onClick,
  disabled = false,
  url,
}: LinkButtonProps) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      <a href={url} rel="noreferrer">
        {label}
      </a>
    </button>
  );
};

export default LinkButton;
