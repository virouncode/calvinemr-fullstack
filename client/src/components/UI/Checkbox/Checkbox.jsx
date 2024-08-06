const Checkbox = ({
  id,
  name,
  onChange,
  onClick,
  checked,
  disabled,
  label,
  mr = 5,
  className = "",
  accentColor = "",
}) => {
  return (
    <>
      <input
        type="checkbox"
        onChange={onChange}
        onClick={onClick}
        checked={checked}
        disabled={disabled}
        style={{ marginRight: `${mr}px`, accentColor: accentColor }}
        id={id}
        name={name}
        className={className}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default Checkbox;
