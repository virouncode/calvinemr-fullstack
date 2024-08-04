const SiteStatusSelect = ({ value, onChange, label = true }) => {
  return (
    <>
      {label && <label htmlFor="status">Site status*:</label>}
      <select name="site_status" value={value} onChange={onChange} id="status">
        <option value="Open">Open</option>
        <option value="Closed">Closed</option>
      </select>
    </>
  );
};

export default SiteStatusSelect;
