import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ClockIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  color?: string;
};
const ClockIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color = "black",
}: ClockIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faClockRotateLeft}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
      className="icon"
    />
  );
};

export default ClockIcon;
