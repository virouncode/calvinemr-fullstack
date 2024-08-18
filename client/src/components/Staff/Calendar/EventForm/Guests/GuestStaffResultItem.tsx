import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../../../types/api";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import UserPlusIcon from "../../../../UI/Icons/UserPlusIcon";

type GuestStaffResultItemProps = {
  staff: StaffType;
  handleAddStaffGuest: (staff: StaffType) => void;
};

const GuestStaffResultItem = ({
  staff,
  handleAddStaffGuest,
}: GuestStaffResultItemProps) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li>
      <span>
        {staffIdToTitleAndName(staffInfos, staff.id, false)} ({staff.title})
      </span>
      <UserPlusIcon ml={10} onClick={() => handleAddStaffGuest(staff)} />
    </li>
  );
};

export default GuestStaffResultItem;
