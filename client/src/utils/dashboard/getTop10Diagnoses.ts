import { BillingType, SiteType } from "../../types/api";
import { topKFrequent } from "../charts/topKFrequent";

export const getTop10Diagnosis = (
  billings: BillingType[],
  sites: SiteType[],
  siteSelectedId: number
) => {
  if (!sites.length || !billings.length) return [];
  let top10DiagnosisForSite: {
    id: number;
    [key: string]: number | string;
    frequency: number;
  }[] = [];
  const billingsForSite =
    siteSelectedId === -1
      ? billings
      : billings.filter(({ site_id }) => site_id === siteSelectedId);
  if (billingsForSite.length > 0) {
    const diagnosisForSite = billingsForSite.map(
      ({ diagnosis_name }) => diagnosis_name?.diagnosis
    );
    top10DiagnosisForSite = topKFrequent(
      diagnosisForSite as string[],
      10,
      "diagnosis"
    );
  } else {
    top10DiagnosisForSite = [];
  }
  return top10DiagnosisForSite;
};
