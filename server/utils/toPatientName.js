const toPatientName = (patientInfos, formatted = true) => {
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

const toPatientFirstName = (patientInfos) => {
  if (!patientInfos) return "";
  const firstName = patientInfos.Names?.LegalName?.FirstName?.Part || "";

  return firstName;
};

const toPatientMiddleName = (patientInfos) => {
  if (!patientInfos) return "";
  const middleName = patientInfos.Names?.LegalName?.OtherName?.[0]?.Part
    ? ` ${patientInfos.Names?.LegalName?.OtherName?.[0]?.Part}`
    : "";
  return middleName;
};

const toPatientLastName = (patientInfos, withTitle = false) => {
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

module.exports = {
  toPatientName,
  toPatientFirstName,
  toPatientMiddleName,
  toPatientLastName,
};
