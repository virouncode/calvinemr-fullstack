import React from "react";
import { SiteType } from "../../../../types/api";
type SiteSelectProps = {
  handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sites: SiteType[];
  value: number;
  label?: string;
  all?: boolean;
};
const SiteSelect = ({
  handleSiteChange,
  sites,
  value,
  label,
  all = false,
}: SiteSelectProps) => {
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
              key={site.id}
              style={{ color: site.site_status === "Closed" ? "red" : "" }}
            >
              {site.name} {site.site_status === "Closed" && "(Closed)"}
            </option>
          ))}
      </select>
    </>
  );
};

export default SiteSelect;
