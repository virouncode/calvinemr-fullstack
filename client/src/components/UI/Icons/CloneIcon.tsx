import { faClone } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type CloneIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};

const CloneIcon = ({ onClick, ml = 0, mr = 0 }: CloneIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faClone}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="icon"
    />
  );
};

export default CloneIcon;
