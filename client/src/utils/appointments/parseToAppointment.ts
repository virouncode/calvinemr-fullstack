import { EventInput } from "@fullcalendar/core";
import { DateTime } from "luxon";
import { AppointmentType } from "../../types/api";
import {
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
} from "../dates/formatDates";

export const parseToAppointment = (event: EventInput) => {
  const appointment: AppointmentType = {
    id: parseInt(event.id ?? "-1"),
    host_id: event.extendedProps?.host,
    date_created: event.extendedProps?.date_created,
    created_by_id: event.extendedProps?.created_by_id,
    created_by_user_type: event.extendedProps?.created_by_user_type,
    start:
      typeof event.start === "number"
        ? event.start
        : DateTime.fromJSDate(event.start as Date, {
            zone: "America/Toronto",
          }).toMillis(),
    end:
      typeof event.end === "number"
        ? event.end
        : DateTime.fromJSDate(event.end as Date, {
            zone: "America/Toronto",
          }).toMillis(),
    patients_guests_ids: event.extendedProps?.patientsGuestsIds,
    staff_guests_ids: event.extendedProps?.staffGuestsIds,
    room_id: event.extendedProps?.roomId,
    all_day: event.allDay ?? false,
    updates: event.extendedProps?.updates,
    AppointmentTime: timestampToTimeISOTZ(event.start as number),
    Duration: event.extendedProps?.duration,
    AppointmentStatus: event.extendedProps?.status,
    AppointmentDate: timestampToDateISOTZ(event.start as number),
    Provider: {
      Name: {
        FirstName: event.extendedProps?.providerFirstName,
        LastName: event.extendedProps?.providerLastName,
      },
      OHIPPhysicianId: event.extendedProps?.providerOHIP,
    },
    AppointmentPurpose: event.extendedProps?.purpose,
    AppointmentNotes: event.extendedProps?.notes,
    site_id: event.extendedProps?.siteId,
    rrule: event.extendedProps?.rrule,
    exrule: event.extendedProps?.exrule,
    recurrence: event.extendedProps?.recurrence,
    invitations_sent: event.extendedProps?.invitations_sent,
    appointment_type: event.extendedProps?.appointment_type,
  };
  return appointment;
};
