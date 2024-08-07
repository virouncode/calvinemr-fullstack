import { toPatientName } from "../../../../utils/names/toPatientName";
import UserPlusIcon from "../../../UI/Icons/UserPlusIcon";

const GuestPatientResultItem = ({
  guest,
  handleAddPatientGuest,
  lastItemRef = null,
}) => {
  return (
    <li ref={lastItemRef}>
      <span>{toPatientName(guest)}</span>
      <UserPlusIcon ml={10} onClick={(e) => handleAddPatientGuest(e, guest)} />
    </li>
  );
};

export default GuestPatientResultItem;
