import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ExclamationTriangleIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
  color?: string;
};

const ExclamationTriangleIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color = "red",
}: ExclamationTriangleIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faTriangleExclamation}
      onClick={onClick}
      style={{
        color: color,
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ExclamationTriangleIcon;
