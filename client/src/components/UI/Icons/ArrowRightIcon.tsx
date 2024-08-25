import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ArrowRightIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};

const ArrowRightIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: ArrowRightIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faArrowRight}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ArrowRightIcon;
