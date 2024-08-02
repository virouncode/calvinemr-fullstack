export const getVisitsPerGender = (sites, visits) => {
  if (!visits.length || !sites.length) return [];
  let totalsBySite = [];
  //By site
  for (const site of sites) {
    let nbrOfMale = 0;
    let nbrOfFemale = 0;
    let nbrOfOther = 0;
    const visitsForSite = visits.filter(({ site_id }) => site_id === site.id);
    for (const visit of visitsForSite) {
      nbrOfMale += visit.patients_guests_ids.filter(
        ({ patient_infos }) => patient_infos?.Gender === "M"
      ).length;
      nbrOfFemale += visit.patients_guests_ids.filter(
        ({ patient_infos }) => patient_infos?.Gender === "F"
      ).length;
      nbrOfOther += visit.patients_guests_ids.filter(
        ({ patient_infos }) => patient_infos?.Gender === "O"
      ).length;
    }
    totalsBySite = [
      ...totalsBySite,
      { male: nbrOfMale, female: nbrOfFemale, other: nbrOfOther },
    ];
  }
  const totals = {
    male: totalsBySite.reduce((acc, current) => {
      return acc + current.male;
    }, 0),
    female: totalsBySite.reduce((acc, current) => {
      return acc + current.female;
    }, 0),
    other: totalsBySite.reduce((acc, current) => {
      return acc + current.other;
    }, 0),
  };
  return [...totalsBySite, totals];
};
