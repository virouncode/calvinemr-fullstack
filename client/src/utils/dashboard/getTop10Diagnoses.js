import { topKFrequent } from "../charts/topKFrequent";

export const getTop10Diagnosis = (billings, sites, siteSelectedId) => {
  if (!sites.length || !billings.length) return [];
  let top10DiagnosisForSite = [];
  const billingsForSite = siteSelectedId
    ? billings.filter(({ site_id }) => site_id === siteSelectedId)
    : billings;
  if (billingsForSite.length > 0) {
    const diagnosisForSite = billingsForSite.map(
      ({ diagnosis_name }) => diagnosis_name.diagnosis
    );
    top10DiagnosisForSite = topKFrequent(diagnosisForSite, 10, "diagnosis");
  } else {
    top10DiagnosisForSite = [];
  }
  return top10DiagnosisForSite;
};
