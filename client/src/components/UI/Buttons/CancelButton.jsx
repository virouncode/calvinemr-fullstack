const CancelButton = ({ label = "Cancel", onClick, disabled = false }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default CancelButton;
