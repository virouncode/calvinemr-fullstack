import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type EnvelopeIconProps = {
  onClick?: () => void;
  ml?: number;
  mr?: number;
};

const EnvelopeIcon = ({ onClick, ml = 0, mr = 0 }: EnvelopeIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faEnvelope}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        fontSize: "0.7rem",
      }}
      className="icon"
    />
  );
};

export default EnvelopeIcon;
