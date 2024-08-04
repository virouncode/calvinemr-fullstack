const UndoneButton = ({ onClick, disabled }) => {
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
      Undone
    </button>
  );
};

export default UndoneButton;
