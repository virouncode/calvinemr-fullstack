import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type StaffListProps = {
  value: number;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const StaffList = ({ value, name, handleChange }: StaffListProps) => {
  const { staffInfos } = useStaffInfosContext();
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
      {staffInfos
        .filter(({ account_status }) => account_status !== "Closed")
        .filter(({ title }) => title !== "Secretary")
        .map((staff) => (
          <option value={staff.id} key={staff.id}>
            {staffIdToTitleAndName(staffInfos, staff.id)} ({staff.title})
          </option>
        ))}
    </select>
  );
};

export default StaffList;
