import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type MicrophoneIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  top?: number;
  right?: number;
  clickable?: boolean;
  color?: string;
};
const MicrophoneIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top,
  right,
  clickable = true,
  color,
}: MicrophoneIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faMicrophone}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        top: `${top}px`,
        right: `${right}px`,
        position: "absolute",
        color: color,
        zIndex: "1000",
      }}
    />
  );
};

export default MicrophoneIcon;
