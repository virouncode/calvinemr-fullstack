import { BillingType, SiteType } from "../../types/api";
import { TotalRevenueBySiteType } from "../../types/app";

export const getRevenues = (billings: BillingType[], sites: SiteType[]) => {
  if (!sites.length || !billings.length) return [];
  let totalsBySite: TotalRevenueBySiteType[] = [];

  for (const site of sites) {
    const billingsForSite = billings.filter(
      ({ site_id }) => site_id === site.id
    );
    const revenueForSite =
      billingsForSite.reduce(
        (acc, current) =>
          acc +
          (current.billing_infos?.anaesthetist_fee || 0) +
          (current.billing_infos?.assistant_fee || 0) +
          (current.billing_infos?.non_anaesthetist_fee || 0) +
          (current.billing_infos?.provider_fee || 0) +
          (current.billing_infos?.specialist_fee || 0),
        0
      ) / 1000;
    totalsBySite = [...totalsBySite, { revenue: revenueForSite }];
  }
  const totals = {
    revenue: totalsBySite.reduce((acc, current) => acc + current.revenue, 0),
  };
  return [...totalsBySite, totals];
};
