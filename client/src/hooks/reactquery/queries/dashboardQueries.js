import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { getLimitTimestampForAge } from "../../../utils/dates/formatDates";

export const useDashboardVisits = (rangeStart, rangeEnd) => {
  return useQuery({
    queryKey: ["dashboardVisits", rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet(`/dashboard/visits_in_range`, "admin", {
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};

export const useDashboardBillings = (rangeStart, rangeEnd) => {
  return useQuery({
    queryKey: ["dashboardBillings", rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet(`/dashboard/billings_in_range`, "admin", {
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};

export const useDashboardMedications = (rangeStart, rangeEnd) => {
  return useQuery({
    queryKey: ["dashboardMedications", rangeStart, rangeEnd],
    queryFn: () =>
      xanoGet(`/dashboard/medications_in_range`, "admin", {
        range_start: rangeStart,
        range_end: rangeEnd,
      }),
  });
};

const fetchPatientsPerGender = async (sites) => {
  try {
    const genders = ["M", "F", "O"];
    let totals = [];
    for (const site of sites) {
      let totalsForSite = {};
      for (let i = 0; i < genders.length; i++) {
        const response = await xanoGet(
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
  } catch (err) {
    throw err;
  }
};

export const useDashboardPatientsPerGender = (sites) => {
  return useQuery({
    queryKey: ["dashboardPatientsPerGender"],
    queryFn: () => fetchPatientsPerGender(sites),
    enabled: !!sites,
  });
};

const fetchPatientsPerAge = async (sites) => {
  try {
    let totals = [];
    for (const site of sites) {
      let totalsForSite = {};
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
  } catch (err) {
    throw err;
  }
};

export const useDashboardPatientsPerAge = (sites) => {
  return useQuery({
    queryKey: ["dashboardPatientsPerAge"],
    queryFn: () => fetchPatientsPerAge(sites),
    enabled: !!sites,
  });
};
