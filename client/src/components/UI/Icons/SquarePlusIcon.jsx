import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SquarePlusIcon = ({ onClick, ml, mr }) => {
  return (
    <FontAwesomeIcon
      icon={faSquarePlus}
      onClick={onClick}
      style={{
        cursor: "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default SquarePlusIcon;
