import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type EyeIconProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  slash?: boolean;
};

const EyeIcon = ({ onClick, slash = false }: EyeIconProps) => {
  return (
    <FontAwesomeIcon
      icon={slash ? faEyeSlash : faEye}
      onClick={onClick}
      className="eye-icon icon"
    />
  );
};

export default EyeIcon;
