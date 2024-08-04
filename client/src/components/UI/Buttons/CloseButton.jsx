const CloseButton = ({ label = "Close", onClick, disabled }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default CloseButton;
