import TriangleIcon from "../Icons/TriangleIcon";

const TriangleClinicalButton = ({ className, color, triangleRef = null }) => {
  return (
    <TriangleIcon
      className={className}
      rotate={180}
      style={{ color: { color } }}
      ref={triangleRef}
    />
  );
};

export default TriangleClinicalButton;
