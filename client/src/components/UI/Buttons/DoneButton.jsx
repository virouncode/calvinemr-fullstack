const DoneButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        marginLeft: "5px",
        fontSize: "0.7rem",
        boxShadow: "none",
      }}
    >
      Done
    </button>
  );
};

export default DoneButton;
