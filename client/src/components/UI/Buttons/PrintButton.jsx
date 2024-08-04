const PrintButton = ({ label = "Print", onClick, disabled, className }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {label}
    </button>
  );
};

export default PrintButton;
