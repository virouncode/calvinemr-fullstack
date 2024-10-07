import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../../../types/api";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

type HostOptionProps = {
  staff: StaffType;
};

const HostOption = ({ staff }: HostOptionProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();

  return (
    <option value={staff.id} key={staff.id}>
      {staffIdToTitleAndName(staffInfos, staff.id)} ({staff.title})
    </option>
  );
};

export default HostOption;
