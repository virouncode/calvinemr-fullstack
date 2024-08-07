import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EnvelopeIcon = ({ onClick, ml, mr }) => {
  return (
    <FontAwesomeIcon
      icon={faEnvelope}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        fontSize: "0.7rem",
      }}
    />
  );
};

export default EnvelopeIcon;
