import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type CopyIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
};
const CopyIcon = ({ onClick, ml = 0, mr = 0 }: CopyIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faCopy}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default CopyIcon;
