const Button = ({ label, onClick, disabled, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {label}
    </button>
  );
};

export default Button;
