export const toCategoriesLength = (staffInfos) => {
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const doctorsLength = activeStaff.filter(
    ({ title }) => title === "Doctor"
  ).length;
  const nursesLength = activeStaff.filter(
    ({ title }) => title === "Nurse"
  ).length;
  const secretariesLength = activeStaff.filter(
    ({ title }) => title === "Secretary"
  ).length;
  const medStudentsLength = activeStaff.filter(
    ({ title }) => title === "Medical Student"
  ).length;
  const nursingStudentsLength = activeStaff.filter(
    ({ title }) => title === "Nursing Student"
  ).length;
  const labTechsLength = activeStaff.filter(
    ({ title }) => title === "Lab Technician"
  ).length;
  const usTechsLength = activeStaff.filter(
    ({ title }) => title === "Ultra Sound Technician"
  ).length;
  const nutritionistsLength = activeStaff.filter(
    ({ title }) => title === "Nutritionist"
  ).length;
  const psychosLength = activeStaff.filter(
    ({ title }) => title === "Psychologist"
  ).length;
  const physiosLength = activeStaff.filter(
    ({ title }) => title === "Physiotherapist"
  ).length;
  const othersLength = activeStaff.filter(
    ({ title }) => title === "Other"
  ).length;

  return [
    doctorsLength,
    nursesLength,
    secretariesLength,
    medStudentsLength,
    nursingStudentsLength,
    labTechsLength,
    usTechsLength,
    nutritionistsLength,
    psychosLength,
    physiosLength,
    othersLength,
  ];
};
