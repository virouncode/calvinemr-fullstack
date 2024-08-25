import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ClipboardIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
};
const ClipboardIcon = ({ onClick, ml = 0, mr = 0 }: ClipboardIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faClipboard}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ClipboardIcon;
