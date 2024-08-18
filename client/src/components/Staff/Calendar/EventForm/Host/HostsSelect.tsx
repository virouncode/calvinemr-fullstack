import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import HostOption from "./HostOption";

type HostsSelectProps = {
  handleHostChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  hostId: number;
  disabled?: boolean;
};

const HostsSelect = ({
  handleHostChange,
  hostId,
  disabled = false,
}: HostsSelectProps) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <select
      name="host_id"
      onChange={handleHostChange}
      value={hostId}
      disabled={disabled}
    >
      <option value="0" disabled>
        Choose a host...
      </option>
      {staffInfos
        .filter(({ account_status }) => account_status !== "Closed")
        .sort((a, b) => a.last_name.localeCompare(b.last_name))
        .map((staff) => (
          <HostOption staff={staff} key={staff.id} />
        ))}
    </select>
  );
};

export default HostsSelect;
