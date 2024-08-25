import { AppointmentType, AvailabilityType } from "../../types/api";
import { AppointmentProposalType, DayType } from "../../types/app";
import { nowTZ } from "../dates/formatDates";
import { getAppointmentProposal } from "./getAppoinmentProposal";

export const getAvailableAppointments = (
  availability: AvailabilityType,
  appointmentsInRange: AppointmentType[] | null,
  practicianSelectedId: number,
  rangeStart: number
) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const defaulDurationMs =
    availability.default_duration_hours * 3600000 +
    availability.default_duration_min * 60000;

  const now = nowTZ();
  const today = now.weekday - 1; //0 is Monday, 6 is Sunday (cf Luxon)
  const proposals: AppointmentProposalType[] = [];
  const tomorrow = (today + 1) % 7; //On commence à regarder à partir de demain
  let counter = 0;

  let newDay = tomorrow;

  while (counter < 7) {
    //On boucle sur une semaine
    while (availability.unavailability[days[newDay] as DayType] === true) {
      //on incrémente newDay jusqu'à ce que le practicien soit dispo
      newDay = (newDay + 1) % 7;
      counter++;
    }
    const deltaNewDay =
      newDay - tomorrow >= 0 ? newDay - tomorrow : 7 + (newDay - tomorrow);

    const appointmentProposal: AppointmentProposalType | null =
      getAppointmentProposal(
        availability,
        appointmentsInRange,
        days[newDay] as DayType,
        deltaNewDay,
        defaulDurationMs,
        practicianSelectedId,
        rangeStart,
        newDay
      );
    if (appointmentProposal) proposals.push(appointmentProposal);
    newDay = (newDay + 1) % 7; //On incrémente
    counter++;
  }
  return proposals;
};
