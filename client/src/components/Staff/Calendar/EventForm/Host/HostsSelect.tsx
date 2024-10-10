import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { splitStaffInfos } from "../../../../../utils/appointments/splitStaffInfos";
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
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const splittedStaffInfos = splitStaffInfos(staffInfos);
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
      {splittedStaffInfos
        .filter(({ infos }) => infos.length)
        .map(({ name, infos }) => (
          <optgroup label={name} key={name}>
            {infos
              .sort((a, b) => a.last_name.localeCompare(b.last_name))
              .map((staff) => (
                <HostOption staff={staff} key={staff.id} />
              ))}
          </optgroup>
        ))}
    </select>
  );
};

export default HostsSelect;
