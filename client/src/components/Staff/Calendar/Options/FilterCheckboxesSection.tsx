import React from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { StaffType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import FilterStaffItem from "./FilterStaffItem";

type FilterCheckboxesSectionProps = {
  isChecked: (id: number) => boolean;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCategoryChecked: (categoryName: string) => boolean;
  handleCheckCategory: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categoryInfos: StaffType[];
  categoryName: string;
  remainingStaff: { id: number; color: string }[];
};

const FilterCheckboxesSection = ({
  isChecked,
  handleCheck,
  isCategoryChecked,
  handleCheckCategory,
  categoryInfos,
  categoryName,
  remainingStaff,
}: FilterCheckboxesSectionProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };

  return (
    <>
      <li className="calendar__staff-checkboxes-title">
        <Checkbox
          id={categoryName}
          onChange={handleCheckCategory}
          checked={isCategoryChecked(categoryName)}
          label={categoryName}
        />
      </li>
      {categoryInfos.map((info) => (
        <FilterStaffItem
          info={info}
          key={info.id}
          handleCheck={handleCheck}
          isChecked={isChecked}
          categoryName={categoryName}
          color={
            info.id !== user.id
              ? remainingStaff.find(({ id }) => id === info.id)?.color ??
                "#8fb4fb"
              : "#8fb4fb"
          }
        />
      ))}
    </>
  );
};

export default FilterCheckboxesSection;
