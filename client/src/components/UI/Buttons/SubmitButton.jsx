const SubmitButton = ({ label = "Submit", disabled = false }) => {
  return (
    <button type="submit" className="save-btn" disabled={disabled}>
      {label}
    </button>
  );
};

export default SubmitButton;
