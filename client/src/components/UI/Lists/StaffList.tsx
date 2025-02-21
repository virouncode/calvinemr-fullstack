import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { splitStaffInfos } from "../../../utils/appointments/splitStaffInfos";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type StaffListProps = {
  value: number;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  all?: boolean;
  onlyDoctors?: boolean;
};

const StaffList = ({
  value,
  name,
  handleChange,
  all = false,
  onlyDoctors = false,
}: StaffListProps) => {
  const { staffInfos } = useStaffInfosContext();
  const splittedStaffInfos = onlyDoctors
    ? splitStaffInfos(staffInfos, true, true)
    : splitStaffInfos(staffInfos, true);
  return (
    <select
      value={value}
      name={name}
      onChange={handleChange}
      style={{ color: value === 0 ? "#a3a3a3" : "" }}
    >
      <option value="0" disabled>
        Choose a practitioner...
      </option>
      {all && <option value="-1">All</option>}
      {splittedStaffInfos
        .filter(({ infos }) => infos.length)
        .map(({ name, infos }) => (
          <optgroup label={name} key={name}>
            {infos
              .sort((a, b) => a.last_name.localeCompare(b.last_name))
              .map((staff) => (
                <option value={staff.id} key={staff.id}>
                  {staffIdToTitleAndName(staffInfos, staff.id)}
                </option>
              ))}
          </optgroup>
        ))}
    </select>
  );
};

export default StaffList;
