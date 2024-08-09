import { SiteType, StaffType } from "../../types/api";
import { TotalStaffDurationBySiteType } from "../../types/app";
import { nowTZTimestamp } from "../dates/formatDates";

export const getStaffDuration = (
  staffInfos: StaffType[],
  sites: SiteType[]
) => {
  if (!sites.length) return [];
  let totalsBySite: TotalStaffDurationBySiteType[] = [];
  const nowMs = nowTZTimestamp();
  for (const site of sites) {
    const staffInfosForSite = staffInfos.filter(
      (staff) => staff.site_id === site.id && staff.account_status === "Active"
    );
    const durations = staffInfosForSite.map(({ date_created }) =>
      Math.floor((nowMs - date_created) / (24 * 60 * 60 * 1000))
    );
    let totalsOfSite: TotalStaffDurationBySiteType = {
      shortest: null,
      longest: null,
    };
    if (durations.length) {
      totalsOfSite = {
        shortest: Math.min(...durations),
        longest: Math.max(...durations),
      };
      totalsBySite = [...totalsBySite, totalsOfSite];
    }
  }
  const shortests = totalsBySite
    .filter(({ shortest }) => shortest)
    .map(({ shortest }) => shortest);
  const longests = totalsBySite
    .filter(({ longest }) => longest)
    .map(({ longest }) => longest);
  const totals: TotalStaffDurationBySiteType = {
    shortest: null,
    longest: null,
  };
  if (shortests) {
    const validShortests = shortests.filter(
      (val): val is number => val !== null
    );
    totals.shortest =
      validShortests.length > 0 ? Math.min(...validShortests) : null;
  }
  if (longests) {
    const validLongests = longests.filter((val): val is number => val !== null);
    totals.longest =
      validLongests.length > 0 ? Math.max(...validLongests) : null;
  }
  return [...totalsBySite, totals];
};
