import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

export const getNextPatientAppointments = (patientAppointments) => {
  if (!patientAppointments || !patientAppointments.length) return [];
  let nextPatientAppointments = [];
  for (let appointment of patientAppointments) {
    if (
      appointment.recurrence === "Once" &&
      appointment.start >= nowTZTimestamp()
    ) {
      nextPatientAppointments.push(appointment);
    } else if (appointment.recurrence !== "Once") {
      if (dateISOToTimestampTZ(appointment.rrule.dtstart) >= nowTZTimestamp()) {
        nextPatientAppointments.push({
          ...appointment,
          rrule: null,
          recurrence: "Once",
          exrule: null,
        });
      } else {
        let start = appointment.start;
        let end = appointment.end;
        while (start < nowTZTimestamp()) {
          [start, end] = toNextOccurence(
            start,
            end,
            appointment.rrule,
            appointment.exrule
          );
        }
        if (
          (appointment.rrule.until &&
            start < dateISOToTimestampTZ(appointment.rrule.until)) ||
          !appointment.rrule.until
        )
          nextPatientAppointments.push({
            ...appointment,
            start,
            end,
            AppointmentDate: timestampToDateISOTZ(start),
            AppointmentTime: timestampToTimeISOTZ(start),
            rrule: null,
            recurrence: "Once",
            exrule: null,
          });
      }
    }
  }
  return nextPatientAppointments.sort((a, b) => a.start - b.start);
};
