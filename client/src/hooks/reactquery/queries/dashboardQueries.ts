import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import {
  AppointmentType,
  BillingType,
  MedType,
  SiteType,
} from "../../../types/api";
import { getLimitTimestampForAge } from "../../../utils/dates/formatDates";

export const useDashboardVisits = (rangeStart: number, rangeEnd: number) => {
  return useQuery<AppointmentType[]>({
    queryKey: ["dashboardVisits", rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet(`/dashboard/visits_in_range`, "admin", {
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};

export const useDashboardBillings = (rangeStart: number, rangeEnd: number) => {
  return useQuery<BillingType[]>({
    queryKey: ["dashboardBillings", rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet(`/dashboard/billings_in_range`, "admin", {
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};

export const useDashboardMedications = (
  rangeStart: number,
  rangeEnd: number
) => {
  return useQuery<MedType[]>({
    queryKey: ["dashboardMedications", rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet(`/dashboard/medications_in_range`, "admin", {
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};

type TotalsForSitePerGenderType = { M: number; F: number; O: number };

const fetchPatientsPerGender = async (sites: SiteType[]) => {
  const genders: ("M" | "F" | "O")[] = ["M", "F", "O"];
  let totals: TotalsForSitePerGenderType[] = [];
  for (const site of sites) {
    const totalsForSite: TotalsForSitePerGenderType = {
      M: 0,
      F: 0,
      O: 0,
    };
    for (let i = 0; i < genders.length; i++) {
      const response: number = await xanoGet(
        "/dashboard/patients_gender_site",
        "admin",
        { site_id: site.id, gender: genders[i] }
      );
      totalsForSite[genders[i]] = response;
    }
    totals = [...totals, totalsForSite];
  }
  const totalMale = totals.reduce((acc, current) => {
    return acc + current["M"];
  }, 0);
  const totalFemale = totals.reduce((acc, current) => {
    return acc + current["F"];
  }, 0);
  const totalOther = totals.reduce((acc, current) => {
    return acc + current["O"];
  }, 0);

  return [...totals, { M: totalMale, F: totalFemale, O: totalOther }];
};

export const useDashboardPatientsPerGender = (sites?: SiteType[]) => {
  return useQuery({
    queryKey: ["dashboardPatientsPerGender"],
    queryFn: () => fetchPatientsPerGender(sites as SiteType[]),
    enabled: !!sites,
  });
};

type TotalsForSitePerAgeType = {
  under18: number;
  from18to35: number;
  from36to50: number;
  from51to70: number;
  over70: number;
};

const fetchPatientsPerAge = async (sites: SiteType[]) => {
  let totals: TotalsForSitePerAgeType[] = [];
  for (const site of sites) {
    const totalsForSite: TotalsForSitePerAgeType = {
      under18: 0,
      from18to35: 0,
      from36to50: 0,
      from51to70: 0,
      over70: 0,
    };
    //<18
    totalsForSite.under18 = await xanoGet(
      "/dashboard/patients_under_age_site",
      "admin",
      {
        site_id: site.id,
        dob_limit: getLimitTimestampForAge(18),
      }
    );

    //18-35
    totalsForSite.from18to35 = await xanoGet(
      "/dashboard/patients_age_range_site",
      "admin",
      {
        site_id: site.id,
        dob_start: getLimitTimestampForAge(35),
        dob_end: getLimitTimestampForAge(18),
      }
    );
    //36-50
    totalsForSite.from36to50 = await xanoGet(
      "/dashboard/patients_age_range_site",
      "admin",
      {
        site_id: site.id,
        dob_start: getLimitTimestampForAge(50),
        dob_end: getLimitTimestampForAge(36),
      }
    );
    //51-70
    totalsForSite.from51to70 = await xanoGet(
      "/dashboard/patients_age_range_site",
      "admin",
      {
        site_id: site.id,
        dob_start: getLimitTimestampForAge(70),
        dob_end: getLimitTimestampForAge(51),
      }
    );
    //>70
    totalsForSite.over70 = await xanoGet(
      "/dashboard/patients_over_age_site",
      "admin",
      {
        site_id: site.id,
        dob_limit: getLimitTimestampForAge(70),
      }
    );
    totals = [...totals, totalsForSite];
  }
  totals = [
    ...totals,
    {
      under18: totals.reduce((acc, current) => {
        return acc + current.under18;
      }, 0),
      from18to35: totals.reduce((acc, current) => {
        return acc + current.from18to35;
      }, 0),
      from36to50: totals.reduce((acc, current) => {
        return acc + current.from36to50;
      }, 0),
      from51to70: totals.reduce((acc, current) => {
        return acc + current.from51to70;
      }, 0),
      over70: totals.reduce((acc, current) => {
        return acc + current.over70;
      }, 0),
    },
  ];
  return totals;
};

export const useDashboardPatientsPerAge = (sites?: SiteType[]) => {
  return useQuery({
    queryKey: ["dashboardPatientsPerAge"],
    queryFn: () => fetchPatientsPerAge(sites as SiteType[]),
    enabled: !!sites,
  });
};
