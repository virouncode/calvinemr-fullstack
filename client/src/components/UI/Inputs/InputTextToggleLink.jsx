const InputTextToggleLink = ({
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
          type="text"
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          autoComplete="off"
          placeholder={placeholder}
        />
      ) : (
        <p>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            {value}
          </a>
        </p>
      )}
    </>
  );
};

export default InputTextToggleLink;
