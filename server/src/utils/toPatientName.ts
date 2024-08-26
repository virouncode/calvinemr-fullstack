export const toPatientName = (
  patientInfos: Record<string, any>,
  formatted = true
) => {
  if (!patientInfos) return "";
  const firstName = patientInfos.Names?.LegalName?.FirstName?.Part || "";
  const lastName = `${patientInfos.Names?.LegalName?.LastName?.Part || ""}`;
  const middleName = patientInfos.Names?.LegalName?.OtherName?.[0]?.Part
    ? ` ${patientInfos.Names?.LegalName?.OtherName?.[0]?.Part}`
    : "";
  const title =
    patientInfos.Gender === "M"
      ? "Mr. "
      : patientInfos.Gender === "F"
      ? "Mrs. "
      : "";
  return formatted
    ? title + lastName.toUpperCase() + ", " + firstName + middleName
    : title + firstName + middleName + " " + lastName;
};

export const toPatientFirstName = (patientInfos: Record<string, any>) => {
  if (!patientInfos) return "";
  const firstName = patientInfos.Names?.LegalName?.FirstName?.Part || "";

  return firstName;
};

export const toPatientMiddleName = (patientInfos: Record<string, any>) => {
  if (!patientInfos) return "";
  const middleName = patientInfos.Names?.LegalName?.OtherName?.[0]?.Part
    ? ` ${patientInfos.Names?.LegalName?.OtherName?.[0]?.Part}`
    : "";
  return middleName;
};

export const toPatientLastName = (
  patientInfos: Record<string, any>,
  withTitle = false
) => {
  if (!patientInfos) return "";
  const lastName = ` ${patientInfos.Names?.LegalName?.LastName?.Part || ""}`;
  const title =
    patientInfos.Gender === "M"
      ? "Mr. "
      : patientInfos.Gender === "F"
      ? "Mrs. "
      : "";
  return withTitle ? title + lastName : lastName;
};
