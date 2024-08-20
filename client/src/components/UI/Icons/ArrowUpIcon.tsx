import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ArrowUpIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const ArrowUpIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: ArrowUpIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faArrowUp}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ArrowUpIcon;
