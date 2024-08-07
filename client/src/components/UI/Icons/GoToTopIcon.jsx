import { faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const GoToTopIcon = ({ onClick, ml = 0, mr = 0, clickable = true }) => {
  return (
    <FontAwesomeIcon
      icon={faAngleDoubleUp}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default GoToTopIcon;
