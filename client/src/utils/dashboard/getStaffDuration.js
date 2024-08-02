import { nowTZTimestamp } from "../dates/formatDates";

export const getStaffDuration = (staffInfos, sites) => {
  if (!sites.length) return [];
  let totalsBySite = [];
  const nowMs = nowTZTimestamp();
  for (const site of sites) {
    const staffInfosForSite = staffInfos.filter(
      (staff) => staff.site_id === site.id && staff.account_status === "Active"
    );
    const durations = staffInfosForSite.map(({ date_created }) =>
      Math.floor((nowMs - date_created) / (24 * 60 * 60 * 1000))
    );
    let totalsOfSite = {};
    if (durations.length) {
      totalsOfSite = {
        shortest: Math.min(...durations),
        longest: Math.max(...durations),
      };
    } else {
      totalsOfSite = { shortest: null, longest: null };
    }
    totalsBySite = [...totalsBySite, totalsOfSite];
  }
  const shortests = totalsBySite
    .filter(({ shortest }) => shortest)
    .map(({ shortest }) => shortest);
  const longests = totalsBySite
    .filter(({ longest }) => longest)
    .map(({ longest }) => longest);

  return [
    ...totalsBySite,
    { shortest: Math.min(...shortests), longest: Math.max(...longests) },
  ];
};
