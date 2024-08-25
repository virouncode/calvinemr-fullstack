import { isDateExceededTZ } from "../dates/formatDates";

export const isMedicationActive = (
  startDate: number | null,
  duration: {
    Y: number;
    M: number;
    W: number;
    D: number;
  }
) => {
  if (!startDate || (!duration.Y && !duration.M && !duration.W && !duration.D))
    return false;
  return !isDateExceededTZ(startDate, duration);
};
