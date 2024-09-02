import React from "react";

type SiteStatusSelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: boolean;
};

const SiteStatusSelect = ({
  value,
  onChange,
  label = true,
}: SiteStatusSelectProps) => {
  return (
    <>
      {label && <label htmlFor="status">Site status*:</label>}
      <select
        name="site_status"
        value={value}
        onChange={onChange}
        id="status"
        style={{ color: value === "" ? "#a3a3a3" : "" }}
      >
        <option value="" disabled>
          Choose a status...
        </option>
        <option value="Open">Open</option>
        <option value="Closed">Closed</option>
      </select>
    </>
  );
};

export default SiteStatusSelect;
