export const bodyMassIndex = (heightCm: string, weightKg: string) => {
  if (!heightCm || !weightKg) return "";
  return (
    Math.round(
      (parseFloat(weightKg) /
        ((parseFloat(heightCm) / 100) * (parseFloat(heightCm) / 100))) *
        10
    ) / 10
  ).toString();
};

export const bodySurfaceArea = (heightCm: string, weightKg: string) => {
  if (!heightCm || !weightKg) return "";
  return (
    Math.round(
      0.007184 *
        Math.pow(parseFloat(heightCm), 0.725) *
        Math.pow(parseFloat(weightKg), 0.425) *
        10
    ) / 10
  ).toString();
};

export const kgToLbs = (weightKg: string) => {
  if (!weightKg) return "";
  return (Math.round(parseFloat(weightKg) * 2.205 * 10) / 10).toString();
};

export const lbsToKg = (weightLbs: string) => {
  if (!weightLbs) return "";
  return Math.round(parseFloat(weightLbs) / 2.205).toString();
};

export const cmToFeet = (heightCm: string) => {
  if (!heightCm) return "";
  return (Math.round((parseFloat(heightCm) / 30.48) * 10) / 10).toString();
};

export const feetToCm = (heightFeet: string) => {
  if (!heightFeet) return "";
  return Math.round(parseFloat(heightFeet) * 30.48).toString();
};
