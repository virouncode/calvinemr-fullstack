import { MedType, SiteType } from "../../types/api";
import { topKFrequent } from "../charts/topKFrequent";

export const getTop10Meds = (
  medications: MedType[],
  sites: SiteType[],
  siteSelectedIdMeds: number
) => {
  if (!sites.length || !medications.length) return [];
  let top10MedsForSite: {
    id: number;
    [key: string]: number | string;
    frequency: number;
  }[] = [];
  const medsForSite =
    siteSelectedIdMeds === -1
      ? medications
      : medications.filter(({ site_id }) => site_id === siteSelectedIdMeds);
  if (medsForSite.length > 0) {
    const medsNamesForSite = medsForSite.map((med) => med.DrugName);
    top10MedsForSite = topKFrequent(medsNamesForSite, 10, "medication");
  } else {
    top10MedsForSite = [];
  }
  return top10MedsForSite;
};
