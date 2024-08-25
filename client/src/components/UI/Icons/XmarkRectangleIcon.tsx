import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type XmarkRectangleIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  color?: string;
  clickable?: boolean;
};

const XmarkRectangleIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color,
  clickable = true,
}: XmarkRectangleIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faRectangleXmark}
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

export default XmarkRectangleIcon;
