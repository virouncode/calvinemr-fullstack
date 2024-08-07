import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const TriangleIcon = ({
  onClick,
  ml = 0,
  mr = 0,
  clickable = true,
  triangleRef,
  className,
  color,
  rotation = 0,
}) => {
  return (
    <FontAwesomeIcon
      icon={faPlay}
      onClick={onClick}
      rotation={rotation}
      style={{
        cursor: clickable && "pointer",
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
        color: color,
        fontSize: "0.7rem",
      }}
      ref={triangleRef}
      className={className}
    />
  );
};

export default TriangleIcon;
