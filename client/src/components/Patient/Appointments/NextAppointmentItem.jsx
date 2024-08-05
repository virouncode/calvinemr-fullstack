import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import NextAppointmentDate from "./NextAppointmentDate";

const NextAppointmentItem = ({
  appointment,
  isAppointmentSelected,
  handleCheck,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li key={appointment.id} className="appointments-patient__item">
      <div className="appointments-patient__date" style={{ width: "50%" }}>
        <Checkbox
          id={appointment.id}
          onChange={handleCheck}
          checked={isAppointmentSelected(appointment.id)}
        />
        <NextAppointmentDate appointment={appointment} />
      </div>
      <div style={{ width: "25%", textAlign: "center" }}>
        Reason : {appointment.AppointmentPurpose}
      </div>
      <div style={{ width: "25%", textAlign: "center" }}>
        {staffIdToTitleAndName(staffInfos, appointment.host_id)}
      </div>
    </li>
  );
};

export default NextAppointmentItem;
