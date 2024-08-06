const InputDate = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  disabled = false,
  min = "1800-01-01",
  max = "3000-01-01",
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="date"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        style={{ width: width ? `${width}px` : "" }}
        disabled={disabled}
        min={min}
        max={max}
      />
    </>
  );
};

export default InputDate;
