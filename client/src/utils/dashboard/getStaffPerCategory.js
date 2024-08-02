import { categoryToTitle } from "../names/categoryToTitle";

export const getStaffPerCategory = (staffInfos, sites) => {
  if (!sites.length) return [];
  const categories = [
    "Doctors",
    "Medical students",
    "Nurses",
    "Nursing students",
    "Secretaries",
    "Ultra sound techs",
    "Lab techs",
    "Nutritionists",
    "Physiotherapists",
    "Psychologists",
    "Others",
  ];
  let totalsBySite = [];
  for (const site of sites) {
    const staffInfosForSite = staffInfos.filter(
      (staff) => staff.site_id === site.id && staff.account_status === "Active"
    );
    const totalsOfSite = {};
    for (let i = 0; i < categories.length; i++) {
      totalsOfSite[categories[i]] = staffInfosForSite.filter(
        ({ title }) => title === categoryToTitle(categories[i])
      ).length;
    }
    totalsBySite = [...totalsBySite, totalsOfSite];
  }
  const totals = {};
  for (let i = 0; i < categories.length; i++) {
    totals[categories[i]] = totalsBySite.reduce((acc, current) => {
      return acc + current[categories[i]];
    }, 0);
  }
  return [...totalsBySite, totals];
};
