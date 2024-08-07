import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ExclamationIcon = ({ onClick, ml = 0, mr = 0, color = "red" }) => {
  return (
    <FontAwesomeIcon
      icon={faCircleExclamation}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
      }}
    />
  );
};

export default ExclamationIcon;
