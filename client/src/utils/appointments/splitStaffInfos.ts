import { StaffType } from "../../types/api";

export const splitStaffInfos = (
  staffInfos: StaffType[],
  noSecretaries = false
) => {
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const doctorsInfos = {
    name: "Doctors",
    infos: activeStaff.filter(({ title }) => title === "Doctor"),
  };
  const medStudentsInfos = {
    name: "Medical Students",
    infos: activeStaff.filter(({ title }) => title === "Medical Student"),
  };
  const nursesInfos = {
    name: "Nurses",
    infos: activeStaff.filter(({ title }) => title === "Nurse"),
  };
  const nursingStudentsInfos = {
    name: "Nursing Students",
    infos: activeStaff.filter(({ title }) => title === "Nursing Student"),
  };
  const secretariesInfos = {
    name: "Secretaries",
    infos: activeStaff.filter(({ title }) => title === "Secretary"),
  };
  const ultrasoundInfos = {
    name: "Ultra Sound Techs",
    infos: activeStaff.filter(
      ({ title }) => title === "Ultra Sound Technician"
    ),
  };
  const labTechInfos = {
    name: "Lab Techs",
    infos: activeStaff.filter(({ title }) => title === "Lab Technician"),
  };
  const nutritionistInfos = {
    name: "Nutritionists",
    infos: activeStaff.filter(({ title }) => title === "Nutritionist"),
  };
  const physiosInfos = {
    name: "Physiotherapists",
    infos: activeStaff.filter(({ title }) => title === "Physiotherapist"),
  };
  const psychosInfos = {
    name: "Psychologists",
    infos: activeStaff.filter(({ title }) => title === "Psychologist"),
  };
  const othersInfos = {
    name: "Others",
    infos: activeStaff.filter(({ title }) => title === "Other"),
  };
  return noSecretaries
    ? [
        doctorsInfos,
        medStudentsInfos,
        nursesInfos,
        nursingStudentsInfos,
        ultrasoundInfos,
        labTechInfos,
        nutritionistInfos,
        physiosInfos,
        psychosInfos,
        othersInfos,
      ]
    : [
        doctorsInfos,
        medStudentsInfos,
        nursesInfos,
        nursingStudentsInfos,
        secretariesInfos,
        ultrasoundInfos,
        labTechInfos,
        nutritionistInfos,
        physiosInfos,
        psychosInfos,
        othersInfos,
      ];
};
