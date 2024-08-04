const InputPassword = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="password"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "" }}
        placeholder={placeholder}
      />
    </>
  );
};

export default InputPassword;
