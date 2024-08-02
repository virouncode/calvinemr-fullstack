const titles = [
  "Doctor",
  "Medical Student",
  "Nurse",
  "Nursing Student",
  "Secretary",
  "Ultra Sound Technician",
  "Lab Technician",
  "Nutritionist",
  "Physiotherapist",
  "Psychologist",
  "Other",
];
const categories = [
  "Doctors",
  "Medical students",
  "Nurses",
  "Nursing students",
  "Secretaries",
  "Ultra sound techs",
  "Lab techs",
  "Nutritionists",
  "Physiotherapists",
  "Psychologists",
  "Others",
];

export const titleToCategory = (title) => {
  return categories[titles.indexOf(title)];
};
