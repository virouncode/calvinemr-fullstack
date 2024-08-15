import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type XmarkIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  color?: string;
  clickable?: boolean;
};
const XmarkIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color,
  clickable = true,
}: XmarkIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faXmark}
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

export default XmarkIcon;
