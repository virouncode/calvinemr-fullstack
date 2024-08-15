import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type CheckIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  color: string;
  clickable?: boolean;
};
const CheckIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color,
  clickable = true,
}: CheckIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faCheck}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
    />
  );
};

export default CheckIcon;
