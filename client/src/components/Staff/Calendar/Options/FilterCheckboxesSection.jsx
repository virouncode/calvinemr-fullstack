import useUserContext from "../../../../hooks/context/useUserContext";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import FilterStaffItem from "./FilterStaffItem";

const FilterCheckboxesSection = ({
  isChecked,
  handleCheck,
  isCategoryChecked,
  handleCheckCategory,
  categoryInfos,
  categoryName,
  remainingStaff,
}) => {
  const { user } = useUserContext();

  return (
    <ul>
      <li className="filter-checkbox-category">
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
              ? remainingStaff.find(({ id }) => id === info.id)?.color
              : "#93B5E9"
          }
        />
      ))}
    </ul>
  );
};

export default FilterCheckboxesSection;
