const Checkbox = ({
  id,
  name,
  onChange,
  onClick,
  checked,
  disabled,
  label,
  labelSide = "right",
  mr = 5,
  className = "",
  accentColor = "",
}) => {
  return (
    <>
      {label && labelSide === "left" && <label htmlFor={id}>{label}</label>}
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
      {label && labelSide === "right" && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default Checkbox;
