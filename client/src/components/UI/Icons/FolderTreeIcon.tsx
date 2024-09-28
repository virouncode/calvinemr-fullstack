import { faFolderTree } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type FolderTreeIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  ml?: number;
  mr?: number;
};
const FolderTreeIcon = ({ onClick, ml = 0, mr = 0 }: FolderTreeIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faFolderTree}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default FolderTreeIcon;
