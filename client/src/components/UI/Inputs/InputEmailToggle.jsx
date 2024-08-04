const InputEmailToggle = ({
  value,
  onChange,
  name,
  id,
  editVisible,
  label,
  placeholder,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
        <input
          type="email"
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          autoComplete="off"
          placeholder={placeholder}
        />
      ) : (
        <p>{value}</p>
      )}
    </>
  );
};

export default InputEmailToggle;
