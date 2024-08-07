import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EyeIcon = ({ onClick, ml, mr, slash = false }) => {
  return (
    <FontAwesomeIcon
      icon={slash ? faEyeSlash : faEye}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        position: "absolute",
        right: "5px",
        fontSize: "0.7rem",
      }}
    />
  );
};

export default EyeIcon;
