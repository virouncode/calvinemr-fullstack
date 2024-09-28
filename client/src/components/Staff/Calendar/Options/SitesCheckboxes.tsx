import React from "react";
import { SiteType } from "../../../../types/api";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type SitesCheckboxesProps = {
  sites: SiteType[];
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const SitesCheckboxes = ({
  sites,
  sitesIds,
  setSitesIds,
}: SitesCheckboxesProps) => {
  const handleCheckAllSitesIds = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setSitesIds(sites.map(({ id }) => id));
    } else {
      setSitesIds([]);
    }
  };
  const handleCheckSiteId = (
    e: React.ChangeEvent<HTMLInputElement>,
    siteId: number
  ) => {
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
  const isSiteIdChecked = (siteId: number) => {
    return sitesIds.includes(siteId);
  };
  const isAllSitesIdsChecked = () => {
    return sitesIds.length === sites.length ? true : false;
  };

  return (
    sites && (
      <ul className="calendar__site-checkboxes">
        <li className="calendar__site-checkboxes-title">
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
              <li key={site.id} className="calendar__site-checkboxes-item">
                <Checkbox
                  id={`site-${site.id}`} //to not confound with staff id
                  onChange={(e) => handleCheckSiteId(e, site.id as number)}
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
