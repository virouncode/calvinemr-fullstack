import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type SquareMinusIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
};

const SquareMinusIcon = ({ onClick, ml = 0, mr = 0 }) => {
  return (
    <FontAwesomeIcon
      icon={faSquareMinus}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default SquareMinusIcon;
