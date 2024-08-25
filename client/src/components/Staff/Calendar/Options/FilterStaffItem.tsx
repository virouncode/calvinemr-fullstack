import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../../types/api";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type FilterStaffItemProps = {
  info: StaffType;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: (id: number) => boolean;
  categoryName: string;
  color: string;
};

const FilterStaffItem = ({
  info,
  handleCheck,
  isChecked,
  categoryName,
  color,
}: FilterStaffItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="filter-checkbox">
      <Checkbox
        id={info.id?.toString()}
        name={categoryName}
        onChange={handleCheck}
        checked={isChecked(info.id)}
        label={staffIdToTitleAndName(staffInfos, info.id)}
        accentColor={color}
      />
    </li>
  );
};

export default FilterStaffItem;
