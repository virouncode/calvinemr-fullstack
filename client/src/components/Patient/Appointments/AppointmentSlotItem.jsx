import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import NewAppointmentDate from "./NewAppointmentDate";

const AppointmentSlotItem = ({
  appointment,
  staffInfos,
  setAppointmentSelected,
  appointmentSelected,
}) => {
  const handleCheck = (e) => {
    const checked = e.target.checked;
    if (checked) setAppointmentSelected(appointment);
    else setAppointmentSelected(0);
  };
  const isAppointmentSelected = (id) => appointmentSelected.id === id;
  return (
    <div key={appointment.id} className="new-appointments__content-item">
      <Checkbox
        checked={isAppointmentSelected(appointment.id)}
        onChange={handleCheck}
        mr={10}
      />
      <div className="new-appointments__content-item-date">
        <NewAppointmentDate appointment={appointment} />
      </div>
      <p>Reason : {appointment.reason}</p>
      <p>{staffIdToTitleAndName(staffInfos, appointment.host_id)}</p>
    </div>
  );
};

export default AppointmentSlotItem;
