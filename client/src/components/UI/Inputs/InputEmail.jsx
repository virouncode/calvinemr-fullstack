const InputEmail = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  autoFocus = false,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="email"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "" }}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </>
  );
};

export default InputEmail;
