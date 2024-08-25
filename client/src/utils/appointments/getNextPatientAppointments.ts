import { AppointmentType } from "../../types/api";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";
import { toNextOccurence } from "./occurences";

export const getNextPatientAppointments = (
  patientAppointments: AppointmentType[]
) => {
  if (!patientAppointments || !patientAppointments.length) return [];
  const nextPatientAppointments: AppointmentType[] = [];
  for (const appointment of patientAppointments) {
    if (
      appointment.recurrence === "Once" &&
      appointment.start >= nowTZTimestamp()
    ) {
      nextPatientAppointments.push(appointment);
    } else if (appointment.recurrence !== "Once") {
      if (
        (dateISOToTimestampTZ(appointment.rrule?.dtstart as string) ?? 0) >=
        nowTZTimestamp()
      ) {
        nextPatientAppointments.push({
          ...appointment,
          rrule: { freq: "", interval: 0, dtstart: "", until: "" },
          recurrence: "Once",
          exrule: [],
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
          (appointment.rrule?.until &&
            start < (dateISOToTimestampTZ(appointment.rrule.until) ?? 0)) ||
          !appointment.rrule?.until
        )
          nextPatientAppointments.push({
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
    }
  }
  return nextPatientAppointments.sort((a, b) => a.start - b.start);
};
