import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../types/api";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";

type ReportsInboxPracticiansListItemForwardProps = {
  info: StaffType;
  handleCheckPractician: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPracticianChecked: (id: number) => boolean;
  categoryName: string;
};

const ReportsInboxPracticiansListItemForward = ({
  info,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}: ReportsInboxPracticiansListItemForwardProps) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="practicians-forward__list-item">
      <Checkbox
        id={info.id.toString()}
        name={categoryName}
        onChange={handleCheckPractician}
        checked={isPracticianChecked(info.id)}
        label={staffIdToTitleAndName(staffInfos, info.id)}
      />
    </li>
  );
};

export default ReportsInboxPracticiansListItemForward;
