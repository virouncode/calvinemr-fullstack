const Input = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  autoFocus,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
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

export default Input;
