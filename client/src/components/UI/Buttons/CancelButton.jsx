const CancelButton = ({ label = "Cancel", onClick, disabled }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default CancelButton;
