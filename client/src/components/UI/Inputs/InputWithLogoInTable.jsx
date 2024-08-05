const InputWithLogoInTable = ({
  id,
  name,
  value,
  onChange,
  onClick,
  label,
  readOnly,
  logo = true,
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
      />
      {logo && (
        <i
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "12px",
            top: "17px",
          }}
          className="fa-solid fa-magnifying-glass"
          onClick={onClick}
        />
      )}
    </>
  );
};

export default InputWithLogoInTable;
