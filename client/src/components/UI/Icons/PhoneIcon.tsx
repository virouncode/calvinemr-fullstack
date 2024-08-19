import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
type PhoneIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
  color: string;
  clickable?: boolean;
};
const PhoneIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  color,
  clickable = true,
}: PhoneIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faPhone}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
        fontSize: "0.7rem",
      }}
    />
  );
};

export default PhoneIcon;
