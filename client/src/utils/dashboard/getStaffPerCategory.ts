import { SiteType, StaffType } from "../../types/api";
import { TotalStaffBySiteType } from "../../types/app";
import { categoryToTitle } from "../names/categoryToTitle";
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
] as const;

export const getStaffPerCategory = (
  staffInfos: StaffType[],
  sites: SiteType[]
) => {
  if (!sites.length) return [];

  let totalsBySite: TotalStaffBySiteType[] = [];
  for (const site of sites) {
    const staffInfosForSite = staffInfos.filter(
      (staff) => staff.site_id === site.id && staff.account_status === "Active"
    );
    const totalsOfSite: TotalStaffBySiteType = {
      Doctors: 0,
      ["Medical students"]: 0,
      Nurses: 0,
      ["Nursing students"]: 0,
      Secretaries: 0,
      ["Ultra sound techs"]: 0,
      ["Lab techs"]: 0,
      Nutritionists: 0,
      Physiotherapists: 0,
      Psychologists: 0,
      Others: 0,
    };
    for (let i = 0; i < categories.length; i++) {
      totalsOfSite[categories[i]] = staffInfosForSite.filter(
        ({ title }) => title === categoryToTitle(categories[i])
      ).length;
    }
    totalsBySite = [...totalsBySite, totalsOfSite];
  }
  const totals: TotalStaffBySiteType = {
    Doctors: 0,
    ["Medical students"]: 0,
    Nurses: 0,
    ["Nursing students"]: 0,
    Secretaries: 0,
    ["Ultra sound techs"]: 0,
    ["Lab techs"]: 0,
    Nutritionists: 0,
    Physiotherapists: 0,
    Psychologists: 0,
    Others: 0,
  };
  for (let i = 0; i < categories.length; i++) {
    totals[categories[i]] = totalsBySite.reduce((acc, current) => {
      return acc + current[categories[i]];
    }, 0);
  }
  return [...totalsBySite, totals];
};
