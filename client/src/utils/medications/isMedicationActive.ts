import { isDateExceededTZ } from "../dates/formatDates";

export const isMedicationActive = (
  startDate: number,
  duration: {
    Y: number;
    M: number;
    W: number;
    D: number;
  }
) => {
  if (!startDate || !duration) return false;
  return !isDateExceededTZ(startDate, duration);
};
