import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../types/api";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";

type StaffContactsListItemProps = {
  info: StaffType;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (id: number) => boolean;
  categoryName: string;
};

const StaffContactsListItem = ({
  info,
  handleCheckContact,
  isContactChecked,
  categoryName,
}: StaffContactsListItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="contacts__list-item">
      <Checkbox
        id={info.id.toString()}
        name={categoryName}
        onChange={handleCheckContact}
        checked={isContactChecked(info.id)}
        label={staffIdToTitleAndName(staffInfos, info.id)}
      />
    </li>
  );
};

export default StaffContactsListItem;
