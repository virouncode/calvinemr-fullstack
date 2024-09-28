import React from "react";
import { AppointmentType } from "../../../types/api";
import { toNextOccurence } from "../../../utils/appointments/occurences";
import {
  timestampToHumanDateTZ,
  timestampToHumanTimeTZ,
} from "../../../utils/dates/formatDates";
type NextAppointmentDateProps = { appointment: AppointmentType };

const NextAppointmentDate = ({ appointment }: NextAppointmentDateProps) => {
  return appointment.all_day ? (
    <label>{`${timestampToHumanDateTZ(appointment.start)} (All Day)`}</label>
  ) : (
    <label>
      {timestampToHumanDateTZ(
        appointment.recurrence === "Once"
          ? appointment.start
          : toNextOccurence(
              appointment.start,
              appointment.end,
              appointment.rrule,
              appointment.exrule
            )[0]
      )}
      ,{" "}
      {timestampToHumanTimeTZ(
        appointment.recurrence === "Once"
          ? appointment.start
          : toNextOccurence(
              appointment.start,
              appointment.end,
              appointment.rrule,
              appointment.exrule
            )[0]
      )}{" "}
      -{" "}
      {timestampToHumanTimeTZ(
        appointment.recurrence === "Once"
          ? appointment.end
          : toNextOccurence(
              appointment.start,
              appointment.end,
              appointment.rrule,
              appointment.exrule
            )[1]
      )}
    </label>
  );
};

export default NextAppointmentDate;
