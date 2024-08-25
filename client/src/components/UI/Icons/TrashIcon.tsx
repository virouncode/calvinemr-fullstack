import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
type TrashIconProps = {
  onClick:
    | (() => void)
    | ((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void);
  ml?: number;
  mr?: number;
};
const TrashIcon = ({ onClick, ml = 0, mr = 0 }: TrashIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faTrash}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default TrashIcon;
