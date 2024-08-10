import React from "react";
import { AppointmentType } from "../../../types/api";
import { toNextOccurence } from "../../../utils/appointments/occurences";
import {
  timestampToHumanDateTimeTZ,
  timestampToHumanDateTZ,
} from "../../../utils/dates/formatDates";
type NextAppointmentDateProps = { appointment: AppointmentType };

const NextAppointmentDate = ({ appointment }: NextAppointmentDateProps) => {
  return !appointment.all_day ? (
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
  );
};

export default NextAppointmentDate;
