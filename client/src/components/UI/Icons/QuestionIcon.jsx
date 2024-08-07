import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const QuestionIcon = ({ onClick, ml = 0, mr = 0 }) => {
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
