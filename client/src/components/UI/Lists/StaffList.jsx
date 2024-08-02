
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const StaffList = ({ value, name, handleChange }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <select value={value} name={name} onChange={handleChange}>
      {staffInfos
        .filter(({ account_status }) => account_status !== "Closed")
        .filter(({ title }) => title !== "Secretary")
        .map((staff) => (
          <option value={staff.id} key={staff.id}>
            {staffIdToTitleAndName(staffInfos, staff.id)}
          </option>
        ))}
    </select>
  );
};

export default StaffList;
