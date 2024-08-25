import { AppointmentType } from "../../types/api";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

export const getPastPatientAppointments = (
  patientAppointments: AppointmentType[]
) => {
  const pastPatientAppointments: AppointmentType[] = [];
  for (const appointment of patientAppointments) {
    if (
      appointment.recurrence === "Once" &&
      appointment.end < nowTZTimestamp()
    ) {
      pastPatientAppointments.push(appointment);
    } else if (appointment.recurrence !== "Once") {
      if (
        (dateISOToTimestampTZ(appointment.rrule?.dtstart) ?? 0) <
        nowTZTimestamp()
      ) {
        let start = appointment.start;
        let end = appointment.end;
        while (
          end < nowTZTimestamp() &&
          (start < (dateISOToTimestampTZ(appointment.rrule?.until) ?? 0) ||
            !appointment.rrule?.until)
        ) {
          pastPatientAppointments.push({
            ...appointment,
            start,
            end,
            AppointmentDate: timestampToDateISOTZ(start),
            AppointmentTime: timestampToTimeISOTZ(start),
            rrule: { freq: "", interval: 0, dtstart: "", until: "" },
            recurrence: "Once",
            exrule: [],
          });
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
  return pastPatientAppointments.sort((a, b) => a.start - b.start);
};
