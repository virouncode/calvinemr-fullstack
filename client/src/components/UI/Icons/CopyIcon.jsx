import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CopyIcon = ({ onClick, ml = 0, mr = 0 }) => {
  return (
    <FontAwesomeIcon
      icon={faCopy}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default CopyIcon;
