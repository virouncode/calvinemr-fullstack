import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const TrashIcon = ({ onClick, ml = 0, mr = 0 }) => {
  return (
    <FontAwesomeIcon
      icon={faTrash}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default TrashIcon;
