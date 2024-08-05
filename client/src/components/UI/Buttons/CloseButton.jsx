const CloseButton = ({ label = "Close", onClick, disabled = false }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default CloseButton;
