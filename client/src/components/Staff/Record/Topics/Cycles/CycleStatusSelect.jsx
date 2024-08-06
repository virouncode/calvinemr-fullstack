const CycleStatusSelect = ({ value, onChange, label }) => {
  return (
    <>
      {label && <label htmlFor="status">{label}</label>}
      <select value={value} onChange={onChange} id="status" name="status">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </>
  );
};

export default CycleStatusSelect;
