import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type PaperclipIconProps = {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};

const PaperclipIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: PaperclipIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faPaperclip}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default PaperclipIcon;
