import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExclamationTriangleIcon = ({ onClick, ml, mr, color = "red" }) => {
  return (
    <FontAwesomeIcon
      icon={faTriangleExclamation}
      onClick={onClick}
      style={{
        color: color,
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default ExclamationTriangleIcon;
