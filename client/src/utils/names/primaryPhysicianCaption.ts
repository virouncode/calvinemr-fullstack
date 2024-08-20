export const primaryPhysicianCaption = (primaryPhysician: {
  Name: { FirstName: string; LastName: string };
  OHIPPhysicianId: string;
  PrimaryPhysicianCPSO: string;
}) => {
  const firstName = primaryPhysician?.Name?.FirstName
    ? `${primaryPhysician?.Name?.FirstName}`
    : "";
  const lastName = primaryPhysician?.Name?.LastName
    ? ` ${primaryPhysician?.Name?.LastName}`
    : "";
  const ohip = primaryPhysician?.OHIPPhysicianId
    ? `, ${primaryPhysician?.OHIPPhysicianId}`
    : "";
  const cpso = primaryPhysician?.PrimaryPhysicianCPSO
    ? `, ${primaryPhysician?.PrimaryPhysicianCPSO}`
    : "";

  return firstName + lastName + ohip + cpso;
};
