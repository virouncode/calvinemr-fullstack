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

  const totals: TotalsForSitePerGenderType[] = await Promise.all(
    sites.map(async (site) => {
      // Fetch data for all genders in parallel for a single site
      const responses = await Promise.all(
        genders.map((gender) =>
          xanoGet("/dashboard/patients_gender_site", "admin", {
            site_id: site.id,
            gender,
          })
        )
      );

      // Map the responses to their respective genders
      const totalsForSite = genders.reduce((acc, gender, idx) => {
        acc[gender] = responses[idx];
        return acc;
      }, {} as TotalsForSitePerGenderType);

      return totalsForSite;
    })
  );

  // Aggregate totals across all sites
  const aggregatedTotals = genders.reduce((acc, gender) => {
    acc[gender] = totals.reduce(
      (sum, siteTotals) => sum + siteTotals[gender],
      0
    );
    return acc;
  }, {} as TotalsForSitePerGenderType);

  // Return site-wise totals along with aggregated totals
  return [...totals, aggregatedTotals];
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
  const ageRanges = [
    {
      key: "under18",
      type: "under_age",
      dobLimit: getLimitTimestampForAge(18),
    },
    {
      key: "from18to35",
      type: "age_range",
      dobStart: getLimitTimestampForAge(35),
      dobEnd: getLimitTimestampForAge(18),
    },
    {
      key: "from36to50",
      type: "age_range",
      dobStart: getLimitTimestampForAge(50),
      dobEnd: getLimitTimestampForAge(36),
    },
    {
      key: "from51to70",
      type: "age_range",
      dobStart: getLimitTimestampForAge(70),
      dobEnd: getLimitTimestampForAge(51),
    },
    { key: "over70", type: "over_age", dobLimit: getLimitTimestampForAge(70) },
  ];

  const totals: TotalsForSitePerAgeType[] = await Promise.all(
    sites.map(async (site) => {
      // Fetch data for all age ranges in parallel for a single site
      const responses = await Promise.all(
        ageRanges.map((range) => {
          if (range.type === "under_age") {
            return xanoGet("/dashboard/patients_under_age_site", "admin", {
              site_id: site.id,
              dob_limit: range.dobLimit,
            });
          } else if (range.type === "over_age") {
            return xanoGet("/dashboard/patients_over_age_site", "admin", {
              site_id: site.id,
              dob_limit: range.dobLimit,
            });
          } else if (range.type === "age_range") {
            return xanoGet("/dashboard/patients_age_range_site", "admin", {
              site_id: site.id,
              dob_start: range.dobStart,
              dob_end: range.dobEnd,
            });
          }
        })
      );

      // Map responses to age ranges
      const totalsForSite = ageRanges.reduce((acc, range, idx) => {
        acc[range.key as keyof TotalsForSitePerAgeType] = responses[idx];
        return acc;
      }, {} as TotalsForSitePerAgeType);

      return totalsForSite;
    })
  );

  // Aggregate totals for all sites
  const aggregatedTotals = ageRanges.reduce((acc, range) => {
    acc[range.key as keyof TotalsForSitePerAgeType] = totals.reduce(
      (sum, siteTotals) =>
        sum + siteTotals[range.key as keyof TotalsForSitePerAgeType],
      0
    );
    return acc;
  }, {} as TotalsForSitePerAgeType);

  // Return site-wise totals along with aggregated totals
  return [...totals, aggregatedTotals];
};

export const useDashboardPatientsPerAge = (sites?: SiteType[]) => {
  return useQuery({
    queryKey: ["dashboardPatientsPerAge"],
    queryFn: () => fetchPatientsPerAge(sites as SiteType[]),
    enabled: !!sites,
  });
};

type TotalsForSitePerCycleType = {
  ["Natural/Investigative"]: number;
  ["IC + Ovulation induction"]: number;
  ["IUI + Ovulation induction"]: number;
  ["IUI Natural cycle"]: number;
  ["IVF antagonist"]: number;
  ["IVF down regulation"]: number;
  ["IVF flare up"]: number;
  ["IVF sandwich"]: number;
  ["IVF duostim"]: number;
  ["FET natural cycle, no trigger"]: number;
  ["FET natural cycle + trigger"]: number;
  ["FET estrace + progesterone"]: number;
  ["FET down regulation"]: number;
  ["Oocyte thaw (own oocytes)"]: number;
  ["Oocyte thaw (donor oocytes)"]: number;
  ["Oocyte cryopreservation"]: number;
  ["Split Fertilization - Oocyte cryopreservation"]: number;
};

const fetchCycles = async (
  sites: SiteType[],
  rangeStart: number,
  rangeEnd: number
) => {
  const cycleTypes = [
    "Natural/Investigative",
    "IC + Ovulation induction",
    "IUI + Ovulation induction",
    "IUI Natural cycle",
    "IVF antagonist",
    "IVF down regulation",
    "IVF flare up",
    "IVF sandwich",
    "IVF duostim",
    "FET natural cycle, no trigger",
    "FET natural cycle + trigger",
    "FET estrace + progesterone",
    "FET down regulation",
    "Oocyte thaw (own oocytes)",
    "Oocyte thaw (donor oocytes)",
    "Oocyte cryopreservation",
    "Split Fertilization - Oocyte cryopreservation",
  ];

  // Create a map to hold all the promises
  const totals: TotalsForSitePerCycleType[] = await Promise.all(
    sites.map(async (site) => {
      // Fetch data for all cycle types in parallel for a single site
      const responses = await Promise.all(
        cycleTypes.map((cycleType) =>
          xanoGet("/dashboard/cycle_type_range_site", "admin", {
            cycle_type: cycleType,
            range_start: rangeStart,
            range_end: rangeEnd,
            site_id: site.id,
          })
        )
      );

      // Map the responses to their respective cycle types
      const totalsForSite = cycleTypes.reduce((acc, cycleType, idx) => {
        acc[cycleType as keyof TotalsForSitePerCycleType] = responses[idx];
        return acc;
      }, {} as TotalsForSitePerCycleType);

      return totalsForSite;
    })
  );

  // Aggregate totals for each cycle type
  const aggregatedTotals = cycleTypes.reduce((acc, cycleType) => {
    acc[cycleType as keyof TotalsForSitePerCycleType] = totals.reduce(
      (sum, siteTotals) =>
        sum + siteTotals[cycleType as keyof TotalsForSitePerCycleType],
      0
    );
    return acc;
  }, {} as TotalsForSitePerCycleType);

  // Return the site-wise totals along with aggregated totals
  return [...totals, aggregatedTotals];
};

export const useDashboardCycles = (
  sites: SiteType[],
  rangeStart: number,
  rangeEnd: number
) => {
  return useQuery({
    queryKey: ["dashboardCycles", rangeStart, rangeEnd],
    queryFn: () => fetchCycles(sites, rangeStart, rangeEnd),
    enabled: !!sites,
  });
};
