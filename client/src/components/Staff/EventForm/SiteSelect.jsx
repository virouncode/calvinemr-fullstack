const SiteSelect = ({ handleSiteChange, sites, value, label, all = false }) => {
  return (
    <>
      {label && (
        <label htmlFor="site-select" style={{ fontWeight: "bold" }}>
          {label}
        </label>
      )}
      <select value={value} onChange={handleSiteChange} id="site-select">
        {all && <option value="-1">All</option>}
        {sites &&
          sites.map((site) => (
            <option
              value={site.id}
              name={site.id}
              key={site.id}
              style={{ color: site.site_status === "Closed" && "red" }}
            >
              {site.name} {site.site_status === "Closed" && "(Closed)"}
            </option>
          ))}
      </select>
    </>
  );
};

export default SiteSelect;
