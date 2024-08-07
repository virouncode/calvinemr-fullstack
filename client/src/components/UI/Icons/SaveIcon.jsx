import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SaveIcon = ({ onClick, ml = 0, mr = 0, color }) => {
  return (
    <FontAwesomeIcon
      icon={faFloppyDisk}
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

export default SaveIcon;
