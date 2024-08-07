import { faClone } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CloneIcon = ({ onClick, ml = 0, mr = 0 }) => {
  return (
    <FontAwesomeIcon
      icon={faClone}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default CloneIcon;
