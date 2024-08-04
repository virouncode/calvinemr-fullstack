const GenderSelect = ({ id, name, value, onChange, label }) => {
  return (
    <>
      {label && <label htmlFor="gender">{label} </label>}
      <select value={value} onChange={onChange} name={name} id={id}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </>
  );
};

export default GenderSelect;
