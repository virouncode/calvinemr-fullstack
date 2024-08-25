import { BillingType, SiteType } from "../../types/api";
import { topKFrequent } from "../charts/topKFrequent";

export const getTop10BillingCodes = (
  billings: BillingType[],
  sites: SiteType[],
  siteSelectedId: number
) => {
  if (!sites.length || !billings.length) return [];
  let top10BillingCodesForSite: {
    id: number;
    [key: string]: number | string;
    frequency: number;
  }[] = [];

  const billingsForSite = siteSelectedId
    ? billings.filter(({ site_id }) => site_id === siteSelectedId)
    : billings;
  if (billingsForSite.length > 0) {
    const billingCodesForSite = billingsForSite.map(
      ({ billing_infos }) => billing_infos?.billing_code
    );
    top10BillingCodesForSite = topKFrequent(
      billingCodesForSite as string[],
      10,
      "billing_code"
    );
  } else {
    top10BillingCodesForSite = [];
  }

  return top10BillingCodesForSite;
};
