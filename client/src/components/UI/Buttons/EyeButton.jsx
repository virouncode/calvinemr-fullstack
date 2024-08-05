const EyeButton = ({ onClick, slash = false }) => {
  return (
    <i
      className={`fa-regular fa-eye${slash ? "-slash" : ""}`}
      style={{
        position: "absolute",
        right: "5px",
        fontSize: "0.7rem",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};

export default EyeButton;
