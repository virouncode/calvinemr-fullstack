

const TriangleButton = ({
  handleTriangleClick,
  className,
  color,
  triangleRef = null,
}) => {
  return (
    <i
      className={`fa-sharp fa-solid fa-play fa-xs ${className}`}
      style={{ color: { color } }}
      onClick={handleTriangleClick}
      ref={triangleRef}
    />
  );
};

export default TriangleButton;
