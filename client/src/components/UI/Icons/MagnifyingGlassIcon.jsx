import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MagnifyingGlassIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  top = 0,
  right = 0,
  clickable = true,
}) => {
  return (
    <FontAwesomeIcon
      icon={faMagnifyingGlass}
      onClick={onClick}
      style={{
        cursor: clickable && "pointer",
        position: "absolute",
        top: `${top}px`,
        right: `${right}px`,
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
    />
  );
};

export default MagnifyingGlassIcon;
