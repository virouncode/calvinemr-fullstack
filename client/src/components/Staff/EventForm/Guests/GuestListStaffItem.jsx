
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

const GuestListStaffItem = ({ staff, handleRemoveStaffGuest }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <span>
      <span>{staffIdToTitleAndName(staffInfos, staff.id, false)}</span>
      <i
        className="fa-solid fa-trash"
        onClick={(e) => handleRemoveStaffGuest(e, staff)}
        style={{ cursor: "pointer", marginLeft: "5px" }}
      />
      ,{" "}
    </span>
  );
};

export default GuestListStaffItem;
