

const SelectTimelineSite = ({ sites, timelineSiteId, setTimelineSiteId }) => {
  const handleChange = (e) => {
    setTimelineSiteId(parseInt(e.target.value));
  };
  return (
    <div className="calendar-section__select-site">
      <label
        style={{ fontWeight: "bold", marginRight: "10px" }}
        htmlFor="timeline-site"
      >
        Site
      </label>
      <select value={timelineSiteId} onChange={handleChange} id="timeline-site">
        {sites.map((site) => (
          <option value={site.id} name={site.id} key={site.id}>
            {site.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTimelineSite;
