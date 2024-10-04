import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type SquareMinusIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};

const SquareMinusIcon = ({ onClick, ml = 0, mr = 0 }: SquareMinusIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faSquareMinus}
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

export default SquareMinusIcon;
