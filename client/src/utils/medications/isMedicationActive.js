import { isDateExceededTZ } from "../dates/formatDates";

export const isMedicationActive = (startDate, duration) => {
  if (!startDate || !duration) return false;
  return !isDateExceededTZ(startDate, duration);
};
