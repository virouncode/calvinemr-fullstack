
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

const GuestStaffResultItem = ({ staff, handleAddStaffGuest }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li>
      <span>
        {staffIdToTitleAndName(staffInfos, staff.id, false)} ({staff.title})
      </span>
      <i
        style={{ marginLeft: "10px", cursor: "pointer" }}
        className="fa-solid fa-user-plus"
        onClick={(e) => handleAddStaffGuest(e, staff)}
      ></i>
    </li>
  );
};

export default GuestStaffResultItem;
