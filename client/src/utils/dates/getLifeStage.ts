import { DateTime } from "luxon";

export function getLifeStage(dateOfBirthMs: number): string {
  const birthDate = DateTime.fromMillis(dateOfBirthMs);
  const now = DateTime.now();
  const ageInDays = now.diff(birthDate, "days").days;
  const ageInYears = now.diff(birthDate, "years").years;

  if (ageInDays <= 28) {
    return "N"; // New born
  } else if (ageInYears < 2) {
    return "I"; // Infant
  } else if (ageInYears >= 2 && ageInYears <= 15) {
    return "C"; // Child
  } else if (ageInYears >= 16 && ageInYears <= 17) {
    return "T"; // Adolescent
  } else {
    return "A"; // Adult
  }
}
