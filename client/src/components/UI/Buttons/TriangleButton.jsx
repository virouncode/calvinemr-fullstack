import TriangleIcon from "../Icons/TriangleIcon";

const TriangleButton = ({ className, color, triangleRef = null }) => {
  return (
    <TriangleIcon
      className={className}
      color={color}
      triangleRef={triangleRef}
    />
  );
};

export default TriangleButton;
