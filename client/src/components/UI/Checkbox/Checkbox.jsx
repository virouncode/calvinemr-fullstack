const Checkbox = ({ id, name, onChange, checked, disabled, label }) => {
  return (
    <>
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        style={{ marginRight: "5px" }}
        id={id}
        name={name}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default Checkbox;
