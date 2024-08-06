const AllDaySelect = ({ value, onChange, name }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{ width: "50px" }}
    >
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  );
};

export default AllDaySelect;
