import { AppointmentType } from "../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

//Funtion to take recurring events into account
export const getAppointmentsInRange = (
  staffAppointmentsInRange: AppointmentType[],
  rangeStart: number,
  rangeEnd: number
) => {
  if (!staffAppointmentsInRange || !staffAppointmentsInRange?.length)
    return null;
  const appointmentsInRange: AppointmentType[] = [];
  for (const appointment of staffAppointmentsInRange) {
    if (appointment.recurrence === "Once") {
      appointmentsInRange.push(appointment);
    } else {
      if (
        dateISOToTimestampTZ(appointment.rrule?.dtstart || "") ??
        0 < rangeEnd
      ) {
        let start = appointment.start;
        let end = appointment.end;
        while (start <= rangeEnd) {
          if (start >= rangeStart) {
            if (
              !appointment.rrule?.until ||
              (appointment.rrule?.until &&
                start <= (dateISOToTimestampTZ(appointment.rrule.until) ?? 0))
            )
              appointmentsInRange.push({
                ...appointment,
                start,
                end,
                AppointmentDate: timestampToDateISOTZ(start),
                AppointmentTime: timestampToTimeISOTZ(start),
                rrule: { freq: "", interval: 0, dtstart: "", until: "" },
                recurrence: "Once",
                exrule: [],
              });
          }
          const nextOccurence = toNextOccurence(
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
