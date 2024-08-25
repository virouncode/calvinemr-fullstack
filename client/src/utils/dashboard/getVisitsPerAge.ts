import { AppointmentType, DemographicsType, SiteType } from "../../types/api";
import { getLimitTimestampForAge } from "../dates/formatDates";

export const getVisitsPerAge = (
  sites: SiteType[],
  visits: AppointmentType[]
) => {
  if (!visits.length || !sites.length) return [];
  let totalsBySite: {
    under18: number;
    from18to35: number;
    from36to50: number;
    from51to70: number;
    over70: number;
  }[] = [];
  //By site
  for (const site of sites) {
    let nbrOfUnder18 = 0;
    let nbrOf1835 = 0;
    let nbrOf3650 = 0;
    let nbrOf5170 = 0;
    let nbrOfOver70 = 0;

    const visitsForSite = visits.filter(({ site_id }) => site_id === site.id);
    for (const visit of visitsForSite) {
      nbrOfUnder18 += (
        visit.patients_guests_ids as { patient_infos: DemographicsType }[]
      ).filter(
        ({ patient_infos }) =>
          patient_infos?.DateOfBirth ?? 0 > getLimitTimestampForAge(18)
      ).length;
      nbrOf1835 += (
        visit.patients_guests_ids as { patient_infos: DemographicsType }[]
      ).filter(
        ({ patient_infos }) =>
          (patient_infos?.DateOfBirth ?? 0) <= getLimitTimestampForAge(18) &&
          (patient_infos?.DateOfBirth ?? 0) >= getLimitTimestampForAge(35)
      ).length;
      nbrOf3650 += (
        visit.patients_guests_ids as { patient_infos: DemographicsType }[]
      ).filter(
        ({ patient_infos }) =>
          (patient_infos?.DateOfBirth ?? 0) <= getLimitTimestampForAge(36) &&
          (patient_infos?.DateOfBirth ?? 0) >= getLimitTimestampForAge(50)
      ).length;
      nbrOf5170 += (
        visit.patients_guests_ids as { patient_infos: DemographicsType }[]
      ).filter(
        ({ patient_infos }) =>
          (patient_infos?.DateOfBirth ?? 0) <= getLimitTimestampForAge(51) &&
          (patient_infos?.DateOfBirth ?? 0) >= getLimitTimestampForAge(70)
      ).length;
      nbrOfOver70 += (
        visit.patients_guests_ids as { patient_infos: DemographicsType }[]
      ).filter(
        ({ patient_infos }) =>
          patient_infos?.DateOfBirth ?? 0 < getLimitTimestampForAge(70)
      ).length;
    }
    totalsBySite = [
      ...totalsBySite,
      {
        under18: nbrOfUnder18,
        from18to35: nbrOf1835,
        from36to50: nbrOf3650,
        from51to70: nbrOf5170,
        over70: nbrOfOver70,
      },
    ];
  }
  const totals = {
    under18: totalsBySite.reduce((acc, current) => {
      return acc + current.under18;
    }, 0),
    from18to35: totalsBySite.reduce((acc, current) => {
      return acc + current.from18to35;
    }, 0),
    from36to50: totalsBySite.reduce((acc, current) => {
      return acc + current.from36to50;
    }, 0),
    from51to70: totalsBySite.reduce((acc, current) => {
      return acc + current.from51to70;
    }, 0),
    over70: totalsBySite.reduce((acc, current) => {
      return acc + current.over70;
    }, 0),
  };
  return [...totalsBySite, totals];
};
