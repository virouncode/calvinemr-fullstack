import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../../UI/Checkbox/Checkbox";

const FilterStaffItem = ({
  info,
  handleCheck,
  isChecked,
  categoryName,
  color,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="filter-checkbox">
      <Checkbox
        id={info.id}
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
