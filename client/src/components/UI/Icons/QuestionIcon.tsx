import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type QuestionIconProps = {
  onClick: () => void;
  ml?: number;
  mr?: number;
};
const QuestionIcon = ({ onClick, ml = 0, mr = 0 }: QuestionIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faCircleQuestion}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default QuestionIcon;
