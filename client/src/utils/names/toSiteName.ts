import { SiteType } from "../../types/api";

export const toSiteName = (sites: SiteType[], siteId: number) => {
  if (!siteId || !sites.length) return "";
  return sites.find(({ id }) => id === siteId)?.name || "";
};
