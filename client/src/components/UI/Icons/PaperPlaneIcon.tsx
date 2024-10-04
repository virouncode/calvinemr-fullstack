import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type PaperPlaneIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
  clickable?: boolean;
};
const PaperPlaneIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
}: PaperPlaneIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faPaperPlane}
      onClick={onClick}
      style={{
        cursor: clickable ? "pointer" : "default",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="icon"
    />
  );
};

export default PaperPlaneIcon;
