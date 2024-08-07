import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import UserPlusIcon from "../../../UI/Icons/UserPlusIcon";

const GuestStaffResultItem = ({ staff, handleAddStaffGuest }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li>
      <span>
        {staffIdToTitleAndName(staffInfos, staff.id, false)} ({staff.title})
      </span>
      <UserPlusIcon ml={10} onClick={(e) => handleAddStaffGuest(e, staff)} />
    </li>
  );
};

export default GuestStaffResultItem;
