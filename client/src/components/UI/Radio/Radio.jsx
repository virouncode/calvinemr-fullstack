const Radio = ({ id, name, value, checked, onChange, label }) => {
  return (
    <>
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        id={id}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default Radio;
