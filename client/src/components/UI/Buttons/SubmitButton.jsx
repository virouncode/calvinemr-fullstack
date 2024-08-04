const SubmitButton = ({ label = "Submit", disabled }) => {
  return (
    <button type="submit" className="save-btn" disabled={disabled}>
      {label}
    </button>
  );
};

export default SubmitButton;
