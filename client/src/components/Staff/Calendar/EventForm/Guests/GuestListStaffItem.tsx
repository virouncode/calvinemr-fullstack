import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../../../types/api";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import TrashIcon from "../../../../UI/Icons/TrashIcon";

type GuestListStaffItemProps = {
  staff: StaffType;
  handleRemoveStaffGuest: (staff: StaffType) => void;
};

const GuestListStaffItem = ({
  staff,
  handleRemoveStaffGuest,
}: GuestListStaffItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <span>
      <span>{staffIdToTitleAndName(staffInfos, staff.id, false)}</span>
      <TrashIcon onClick={() => handleRemoveStaffGuest(staff)} ml={5} />,{" "}
    </span>
  );
};

export default GuestListStaffItem;
