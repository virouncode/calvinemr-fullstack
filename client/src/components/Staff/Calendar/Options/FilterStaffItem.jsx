import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../../UI/Checkbox/Checkbox";

const FilterStaffItem = ({
  staff,
  category,
  isChecked,
  handleCheck,
  color,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="filter-checkbox">
      <Checkbox
        id={`staff-${staff.id}`}
        name={categoryToTitle(category).toLowerCase()}
        onChange={(e) => handleCheck(e, staff.id)}
        checked={isChecked(staff.id)}
        label={staffIdToTitleAndName(staffInfos, staff.id)}
        accentColor={color}
      />
    </li>
  );
};

export default FilterStaffItem;
