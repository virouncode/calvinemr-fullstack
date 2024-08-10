import { DateTime } from "luxon";
import { AppointmentType, AvailabilityType } from "../../types/api";
import { AppointmentProposalType } from "../../types/app";
import { AMPMto24 } from "../dates/formatDates";

export const getAppointmentProposal = (
  availability: AvailabilityType,
  appointmentsInRange: AppointmentType[] | null,
  day: string,
  delta: number,
  defaulDurationMs: number,
  practicianSelectedId: number,
  rangeStart: number,
  id: number
): AppointmentProposalType | null => {
  //Morning
  const availabilityMorning: {
    hours: string;
    min: string;
    ampm: string;
  } = availability.schedule_morning[day];
  let startMorningMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityMorning[0].hours),
        availabilityMorning[0].ampm
      ),
      minutes: parseInt(availabilityMorning[0].min),
    })
    .toMillis();

  const endMorningMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityMorning[1].hours),
        availabilityMorning[1].ampm
      ),
      minutes: parseInt(availabilityMorning[1].min),
    })
    .toMillis();

  //Afternoon
  const availabilityAfternoon: {
    hours: string;
    min: string;
    ampm: string;
  } = availability.schedule_afternoon[day];
  let startAfternoonMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityAfternoon[0].hours),
        availabilityAfternoon[0].ampm
      ),
      minutes: parseInt(availabilityAfternoon[0].min),
    })
    .toMillis();

  const endAfternoonMs = DateTime.fromMillis(rangeStart, {
    zone: "America/Toronto",
  })
    .plus({
      days: delta,
      hours: AMPMto24(
        parseInt(availabilityAfternoon[1].hours),
        availabilityMorning[1].ampm
      ),
      minutes: parseInt(availabilityAfternoon[1].min),
    })
    .toMillis();

  while (
    appointmentsInRange
      ?.filter(
        // eslint-disable-next-line no-loop-func
        (appointment) =>
          (appointment.start >= startMorningMs &&
            appointment.start < startMorningMs + defaulDurationMs) ||
          (appointment.end > startMorningMs &&
            appointment.end <= startMorningMs + defaulDurationMs) ||
          (appointment.start <= startMorningMs &&
            appointment.end >= startMorningMs + defaulDurationMs)
      )
      .sort((a, b) => b.end - a.end).length
  ) {
    startMorningMs = appointmentsInRange
      ?.filter(
        // eslint-disable-next-line no-loop-func
        (appointment) =>
          (appointment.start >= startMorningMs &&
            appointment.start < startMorningMs + defaulDurationMs) ||
          (appointment.end > startMorningMs &&
            appointment.end <= startMorningMs + defaulDurationMs) ||
          (appointment.start <= startMorningMs &&
            appointment.end >= startMorningMs + defaulDurationMs)
      )
      .sort((a, b) => b.end - a.end)[0].end;
  }
  if (startMorningMs + defaulDurationMs > endMorningMs) {
    while (
      appointmentsInRange
        ?.filter(
          // eslint-disable-next-line no-loop-func
          (appointment) =>
            (appointment.start >= startAfternoonMs &&
              appointment.start < startAfternoonMs + defaulDurationMs) ||
            (appointment.end > startAfternoonMs &&
              appointment.end <= startAfternoonMs + defaulDurationMs) ||
            (appointment.start <= startAfternoonMs &&
              appointment.end >= startAfternoonMs + defaulDurationMs)
        )
        .sort((a, b) => b.end - a.end).length
    ) {
      startAfternoonMs = appointmentsInRange
        .filter(
          // eslint-disable-next-line no-loop-func
          (appointment) =>
            (appointment.start >= startAfternoonMs &&
              appointment.start < startAfternoonMs + defaulDurationMs) ||
            (appointment.end > startAfternoonMs &&
              appointment.end <= startAfternoonMs + defaulDurationMs) ||
            (appointment.start <= startAfternoonMs &&
              appointment.end >= startAfternoonMs + defaulDurationMs)
        )
        .sort((a, b) => b.end - a.end)[0].end;
    }
    if (startAfternoonMs + defaulDurationMs > endAfternoonMs) {
      return null;
    } else
      return {
        id: id,
        host_id: practicianSelectedId,
        start: startAfternoonMs,
        end: startAfternoonMs + defaulDurationMs,
        reason: "Appointment",
        all_day: false,
      };
  } else {
    return {
      id: id,
      host_id: practicianSelectedId,
      start: startMorningMs,
      end: startMorningMs + defaulDurationMs,
      reason: "Appointment",
      all_day: false,
    };
  }
};
