import Checkbox from "../../../UI/Checkbox/Checkbox";

const SitesCheckboxes = ({ sites, sitesIds, setSitesIds }) => {
  const handleCheckAllSitesIds = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSitesIds(sites.map(({ id }) => id));
    } else {
      setSitesIds([]);
    }
  };
  const handleCheckSiteId = (e, siteId) => {
    const checked = e.target.checked;
    if (checked) {
      if (
        [...sitesIds, siteId].length ===
        sites.filter(({ site_status }) => site_status !== "Closed").length
      )
        setSitesIds(sites.map(({ id }) => id));
      else setSitesIds([...sitesIds, siteId]);
    } else {
      setSitesIds(sitesIds.filter((id) => id !== siteId));
    }
  };
  const isSiteIdChecked = (siteId) => {
    return sitesIds.includes(siteId);
  };
  const isAllSitesIdsChecked = () => {
    return sitesIds.length === sites.length ? true : false;
  };

  return (
    sites && (
      <ul className="site-checkboxes">
        <li className="site-checkboxes__title">
          <Checkbox
            id="sites"
            onChange={handleCheckAllSitesIds}
            checked={isAllSitesIdsChecked()}
            label="Sites"
          />
        </li>
        {sites &&
          sites
            .filter(({ site_status }) => site_status !== "Closed")
            .map((site) => (
              <li key={site.id} className="site-checkboxes__item">
                <Checkbox
                  id={`site-${site.id}`} //to not confound with staff id
                  onChange={(e) => handleCheckSiteId(e, site.id)}
                  checked={isSiteIdChecked(site.id)}
                  label={site.name}
                />
              </li>
            ))}
      </ul>
    )
  );
};

export default SitesCheckboxes;
