import { DateTime } from "luxon";
import {
  AppointmentModeType,
  AppointmentType,
  AvailabilityType,
  TimeSlotType,
} from "../../types/api";
import { AppointmentProposalType, DayType } from "../../types/app";
import { AMPMto24 } from "../dates/formatDates";

export const getAppointmentProposal = (
  availability: AvailabilityType,
  appointmentsInRange: AppointmentType[] | null,
  day: DayType,
  delta: number,
  defaulDurationMs: number,
  practicianSelectedId: number,
  rangeStart: number,
  id: number,
  appointmentMode: AppointmentModeType
): AppointmentProposalType | null => {
  //Morning
  const availabilityMorning: TimeSlotType[] | null =
    availability.schedule_morning[day][0].appointment_modes.includes(
      appointmentMode
    )
      ? availability.schedule_morning[day]
      : null;

  const availabilityAfternoon: TimeSlotType[] | null =
    availability.schedule_afternoon[day][0].appointment_modes.includes(
      appointmentMode
    )
      ? availability.schedule_afternoon[day]
      : null;

  if (!availabilityMorning && !availabilityAfternoon) return null;

  //DISPOS LE MATIN
  if (availabilityMorning) {
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

    //IL Y A DES RDV DANS LA PLAGE HORAIRE, on calcule le nouveau startMorningMs
    if (appointmentsInRange && appointmentsInRange.length) {
      while (
        appointmentsInRange
          .filter(
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
          .filter(
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
    }
    //Si le nouveau startMorningMs + defaulDurationMs dépasse la fin de la plage horaire, on regarde l'après-midi
    if (startMorningMs + defaulDurationMs > endMorningMs) {
      //Pas de dispo l'après-midi, on ne peut pas proposer de rendez-vous
      if (!availabilityAfternoon) return null;
      //On regarde l'après-midi
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
            availabilityAfternoon[1].ampm
          ),
          minutes: parseInt(availabilityAfternoon[1].min),
        })
        .toMillis();
      if (appointmentsInRange && appointmentsInRange.length) {
        while (
          appointmentsInRange
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
      }
      //Si le nouveau startAfternoonMs + defaulDurationMs dépasse la fin de la plage horaire, on ne peut pas proposer de rendez-vous
      if (startAfternoonMs + defaulDurationMs > endAfternoonMs) {
        return null;
      }
      //On peut proposer un rendez-vous l'après-midi
      return {
        id: id,
        host_id: practicianSelectedId,
        start: startAfternoonMs,
        end: startAfternoonMs + defaulDurationMs,
        reason: "Appointment",
        all_day: false,
      };
    } else {
      //On peut proposer un rendez-vous le matin
      return {
        id: id,
        host_id: practicianSelectedId,
        start: startMorningMs,
        end: startMorningMs + defaulDurationMs,
        reason: "Appointment",
        all_day: false,
      };
    }
  } else if (availabilityAfternoon) {
    //DISPO QUE L'APRES-MIDI
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
          availabilityAfternoon[1].ampm
        ),
        minutes: parseInt(availabilityAfternoon[1].min),
      })
      .toMillis();
    if (appointmentsInRange && appointmentsInRange.length) {
      while (
        appointmentsInRange
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
    }
    if (startAfternoonMs + defaulDurationMs > endAfternoonMs) {
      return null;
    }
    return {
      id: id,
      host_id: practicianSelectedId,
      start: startAfternoonMs,
      end: startAfternoonMs + defaulDurationMs,
      reason: "Appointment",
      all_day: false,
    };
  } else {
    //Pas de dispo le matin ni l'après-midi
    return null;
  }
};
