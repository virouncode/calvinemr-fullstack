const SaveButton = ({ label = "Save", onClick, disabled }) => {
  return (
    <button
      type="button"
      className="save-btn"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default SaveButton;
