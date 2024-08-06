const InputNumber = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  autoFocus = false,
  readOnly = false,
  className = "",
  step = "1",
  min = "0",
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "" }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className={className}
        step={step}
        min={min}
      />
    </>
  );
};

export default InputNumber;
