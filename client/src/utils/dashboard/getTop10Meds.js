import { topKFrequent } from "../charts/topKFrequent";

export const getTop10Meds = (medications, sites, siteSelectedIdMeds) => {
  if (!sites.length || !medications.length) return [];
  let top10MedsForSite = [];
  const medsForSite = siteSelectedIdMeds
    ? medications.filter(({ site_id }) => site_id === siteSelectedIdMeds)
    : medications;
  if (medsForSite.length > 0) {
    const medsNamesForSite = medsForSite.map((med) => med.DrugName);
    top10MedsForSite = topKFrequent(medsNamesForSite, 10, "medication");
  } else {
    top10MedsForSite = [];
  }
  return top10MedsForSite;
};
