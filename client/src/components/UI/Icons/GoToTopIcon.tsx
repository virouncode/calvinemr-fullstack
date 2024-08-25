import { faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type GoToTopIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const GoToTopIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: GoToTopIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faAngleDoubleUp}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default GoToTopIcon;
