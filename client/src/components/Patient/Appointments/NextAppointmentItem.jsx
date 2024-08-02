
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { toNextOccurence } from "../../../utils/appointments/occurences";
import {
    timestampToHumanDateTZ,
    timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const NextAppointmentItem = ({
  appointment,
  isAppointmentSelected,
  handleCheck,
}) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <li key={appointment.id} className="appointments-patient__item">
      <div className="appointments-patient__date" style={{ width: "50%" }}>
        <input
          type="checkbox"
          checked={isAppointmentSelected(appointment.id)}
          onChange={handleCheck}
          id={appointment.id}
          style={{ textAlign: "center", margin: "4px" }}
        />
        {!appointment.all_day ? (
          <>
            <div style={{ width: "45%", textAlign: "center" }}>
              {timestampToHumanDateTimeTZ(
                appointment.recurrence === "Once"
                  ? appointment.start
                  : toNextOccurence(
                      appointment.start,
                      appointment.end,
                      appointment.rrule,
                      appointment.exrule
                    )[0]
              )}
            </div>
            <div style={{ width: "5%", textAlign: "center" }}>-</div>
            <div style={{ width: "45%", textAlign: "center" }}>
              {timestampToHumanDateTimeTZ(
                appointment.recurrence === "Once"
                  ? appointment.end
                  : toNextOccurence(
                      appointment.start,
                      appointment.end,
                      appointment.rrule,
                      appointment.exrule
                    )[1]
              )}
            </div>
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            {timestampToHumanDateTZ(appointment.start)} {`All Day`}
          </div>
        )}
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
