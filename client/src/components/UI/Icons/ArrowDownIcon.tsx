import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ArrowDownIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};

const ArrowDownIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: ArrowDownIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faArrowDown}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ArrowDownIcon;
