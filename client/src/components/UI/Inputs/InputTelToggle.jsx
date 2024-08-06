const InputTelToggle = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  editVisible,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
        <input
          type="tel"
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          autoComplete="off"
          style={{ width: width ? `${width}px` : "" }}
          placeholder={placeholder}
        />
      ) : (
        <p>{value}</p>
      )}
    </>
  );
};

export default InputTelToggle;
