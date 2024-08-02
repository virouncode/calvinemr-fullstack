import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

//Funtion to take recurring events into account
export const getAppointmentsInRange = (
  staffAppointmentsInRange,
  rangeStart,
  rangeEnd
) => {
  if (!staffAppointmentsInRange || !staffAppointmentsInRange?.length)
    return null;
  let appointmentsInRange = [];
  for (let appointment of staffAppointmentsInRange) {
    if (appointment.recurrence === "Once") {
      appointmentsInRange.push(appointment);
    } else {
      if (dateISOToTimestampTZ(appointment.rrule.dtstart) < rangeEnd) {
        let start = appointment.start;
        let end = appointment.end;
        while (start <= rangeEnd) {
          if (start >= rangeStart) {
            if (
              !appointment.rrule.until ||
              (appointment.rrule.until &&
                start <= dateISOToTimestampTZ(appointment.rrule.until))
            )
              appointmentsInRange.push({
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
          let nextOccurence = toNextOccurence(
            start,
            end,
            appointment.rrule,
            appointment.exrule
          );
          start = nextOccurence[0];
          end = nextOccurence[1];
        }
      }
    }
  }
  return appointmentsInRange;
};
