
import { toPatientName } from "../../../../utils/names/toPatientName";

const GuestPatientResultItem = ({
  guest,
  handleAddPatientGuest,
  lastItemRef = null,
}) => {
  return (
    <li ref={lastItemRef}>
      <span>{toPatientName(guest)}</span>
      <i
        style={{ marginLeft: "10px", cursor: "pointer" }}
        className="fa-solid fa-user-plus"
        onClick={(e) => handleAddPatientGuest(e, guest)}
      ></i>
    </li>
  );
};

export default GuestPatientResultItem;
