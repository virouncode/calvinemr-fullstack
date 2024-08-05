const InputDate = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  disabled = false,
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
      />
    </>
  );
};

export default InputDate;
