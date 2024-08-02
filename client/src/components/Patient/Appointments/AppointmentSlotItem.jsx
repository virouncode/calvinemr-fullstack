import { DateTime } from "luxon";

import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const optionsDate = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

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
      <input
        type="checkbox"
        checked={isAppointmentSelected(appointment.id)}
        onChange={handleCheck}
      />
      <div className="new-appointments__content-item-date">
        <p>
          {DateTime.fromMillis(appointment.start, {
            zone: "America/Toronto",
            locale: "en-CA",
          }).toLocaleString(optionsDate)}
        </p>
        <p>
          {DateTime.fromMillis(appointment.start, {
            zone: "America/Toronto",
            locale: "en-CA",
          }).toLocaleString(DateTime.TIME_SIMPLE)}{" "}
          -{" "}
          {DateTime.fromMillis(appointment.end, {
            zone: "America/Toronto",
            locale: "en-CA",
          }).toLocaleString(DateTime.TIME_SIMPLE)}
        </p>
      </div>
      <p>Reason : {appointment.reason}</p>
      <p>{staffIdToTitleAndName(staffInfos, appointment.host_id)}</p>
    </div>
  );
};

export default AppointmentSlotItem;
