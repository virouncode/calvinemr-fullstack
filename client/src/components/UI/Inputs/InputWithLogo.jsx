const InputWithLogo = ({
  id,
  name,
  value,
  onChange,
  onClick,
  label,
  readOnly,
  logo = true,
  width,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        id="provider_ohip_billing_nbr"
        style={{ width: width ? `${width}px` : "" }}
      />
      {logo && (
        <i
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "5px",
            top: "5px",
          }}
          className="fa-solid fa-magnifying-glass"
          onClick={onClick}
        />
      )}
    </>
  );
};

export default InputWithLogo;
