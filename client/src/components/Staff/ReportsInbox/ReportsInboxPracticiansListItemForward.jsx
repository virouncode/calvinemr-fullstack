import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";

const ReportsInboxPracticiansListItemForward = ({
  info,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="practicians-forward__list-item">
      <Checkbox
        id={info.id}
        name={categoryName}
        onChange={handleCheckPractician}
        checked={isPracticianChecked(info.id)}
        label={staffIdToTitleAndName(staffInfos, info.id)}
      />
    </li>
  );
};

export default ReportsInboxPracticiansListItemForward;
