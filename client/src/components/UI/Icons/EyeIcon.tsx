import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type EyeIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
  slash?: boolean;
};

const EyeIcon = ({ onClick, ml = 0, mr = 0, slash = false }: EyeIconProps) => {
  return (
    <FontAwesomeIcon
      icon={slash ? faEyeSlash : faEye}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        position: "absolute",
        right: "5px",
        fontSize: "0.7rem",
      }}
    />
  );
};

export default EyeIcon;
