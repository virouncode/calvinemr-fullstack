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

export const cmToFeetAndInches = (heightCm: string) => {
  if (!heightCm) return "";

  const totalFeet = parseFloat(heightCm) / 30.48;
  const feet = Math.floor(totalFeet); // Get the whole feet part
  const inches = Math.round((totalFeet - feet) * 12); // Convert the decimal part to inches

  return `${feet}'${inches}"`; // Return in feet and inches format
};

export const feetAndInchesToCm = (heightFeetAndInches: string) => {
  if (!heightFeetAndInches) return "";

  // Remove any whitespace and split the height into feet and inches
  const [feetPart, inchesPart] = heightFeetAndInches
    .trim()
    .split("'")
    .map((part) => part.trim());

  // Parse feet and inches
  const feet = parseInt(feetPart, 10);
  const inches = inchesPart ? parseInt(inchesPart.replace('"', ""), 10) : 0;

  // Convert to centimeters
  const totalCm = Math.floor(feet * 30.48 + inches * 2.54); // Round down to the nearest integer

  return totalCm.toString(); // Return the result as an integer
};
export const feetAndInchesToDecimalNumber = (height: string) => {
  if (!height) return 0; // Return 0 if input is empty

  // Regular expression to match feet and inches
  const regex = /^(\d{1,2})'(\d{1,2})?"$|^(\d{1,2})'?$|^(\d{1,2})$/;

  const match = height.trim().match(regex);

  if (!match) return 0; // Return 0 if the input does not match the expected format

  let feet = 0;
  let inches = 0;

  // Check which capturing group matched and assign feet and inches
  if (match[1] && match[2]) {
    feet = parseInt(match[1], 10); // Feet from 5'7"
    inches = parseInt(match[2], 10); // Inches from 5'7"
  } else if (match[3]) {
    feet = parseInt(match[3], 10); // Feet from 5'
  } else if (match[4]) {
    feet = parseInt(match[4], 10); // Feet from just 5
  }

  // Convert inches to feet and return the total in decimal form
  return feet + inches / 12;
};
