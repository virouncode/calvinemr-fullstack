import { DateTime } from "luxon";
import {
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";

export const parseToAppointment = (event) => {
  const appointment = {
    id: parseInt(event.id),
    host_id: event.extendedProps.host,
    date_created: event.extendedProps.date_created,
    created_by_id: event.extendedProps.created_by_id,
    start:
      typeof event.start === "number"
        ? event.start
        : DateTime.fromJSDate(event.start, {
            zone: "America/Toronto",
          }).toMillis(),
    end:
      typeof event.end === "number"
        ? event.end
        : DateTime.fromJSDate(event.end, {
            zone: "America/Toronto",
          }).toMillis(),
    patients_guests_ids: event.extendedProps.patientsGuestsIds,
    staff_guests_ids: event.extendedProps.staffGuestsIds,
    room_id: event.extendedProps.roomId,
    all_day: event.allDay,
    updates: event.extendedProps.updates,
    AppointmentTime:
      typeof event.start === "number"
        ? timestampToTimeISOTZ(event.start)
        : timestampToTimeISOTZ(
            DateTime.fromJSDate(event.start, {
              zone: "America/Toronto",
            }).toMillis()
          ),
    Duration: event.extendedProps.duration,
    AppointmentStatus: event.extendedProps.status,
    AppointmentDate:
      typeof event.start === "number"
        ? timestampToDateISOTZ(event.start)
        : timestampToDateISOTZ(
            DateTime.fromJSDate(event.start, {
              zone: "America/Toronto",
            }).toMillis()
          ),
    Provider: {
      Name: {
        FirstName: event.extendedProps.providerFirstName,
        LastName: event.extendedProps.providerLastName,
      },
      OHIPPhysicianId: event.extendedProps.providerOHIP,
    },
    AppointmentPurpose: event.extendedProps.purpose,
    AppointmentNotes: event.extendedProps.notes,
    site_id: event.extendedProps.siteId,
    rrule: event.extendedProps.rrule,
    exrule: event.extendedProps.exrule,
    recurrence: event.extendedProps.recurrence,
  };
  return appointment;
};
