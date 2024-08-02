
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import FilterStaffItem from "./FilterStaffItem";

const FilterCheckboxesSection = ({
  isCategoryChecked,
  handleCheckCategory,
  category,
  isChecked,
  handleCheck,
  remainingStaff,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  return (
    <ul>
      <li>
        <input
          type="checkbox"
          className="filter-checkbox-category"
          name={category}
          id={category}
          checked={isCategoryChecked(category)}
          onChange={(e) => handleCheckCategory(category, e)}
          autoComplete="off"
        />
        <label htmlFor={category} className="filter-category-label">
          {category}
        </label>
      </li>
      {activeStaff
        .filter(({ title }) => title === categoryToTitle(category))
        .map((staff) => (
          <FilterStaffItem
            key={staff.id}
            staff={staff}
            category={category}
            isChecked={isChecked}
            handleCheck={handleCheck}
            color={
              staff.id !== user.id
                ? remainingStaff.find(({ id }) => id === staff.id)?.color
                : "#93B5E9"
            }
          />
        ))}
    </ul>
  );
};

export default FilterCheckboxesSection;
