import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";

const StaffContactsListItem = ({
  info,
  handleCheckContact,
  isContactChecked,
  categoryName,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="contacts-list__item">
      <Checkbox
        id={info.id}
        name={categoryName}
        onChange={handleCheckContact}
        checked={isContactChecked(info.id)}
        label={staffIdToTitleAndName(staffInfos, info.id)}
      />
    </li>
  );
};

export default StaffContactsListItem;
