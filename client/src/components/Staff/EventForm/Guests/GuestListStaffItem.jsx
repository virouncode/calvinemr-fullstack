import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import TrashIcon from "../../../UI/Icons/TrashIcon";

const GuestListStaffItem = ({ staff, handleRemoveStaffGuest }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <span>
      <span>{staffIdToTitleAndName(staffInfos, staff.id, false)}</span>
      <TrashIcon
        onClick={(e) => handleRemoveStaffGuest(e, staff)}
        ml={5}
      />,{" "}
    </span>
  );
};

export default GuestListStaffItem;
