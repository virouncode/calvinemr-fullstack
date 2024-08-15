import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type CrossArrowIconProps = {
  onPointerDown: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const CrossArrowIcon = ({
  onPointerDown,
  ml = 0,
  mr = 0,
  clickable = true,
}: CrossArrowIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faArrowsUpDownLeftRight}
      onPointerDown={onPointerDown}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        touchAction: "none",
      }}
    />
  );
};

export default CrossArrowIcon;
