import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { cycleTypes } from "../../../components/UI/Lists/CycleTypeList";
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
  let totals: TotalsForSitePerCycleType[] = [];
  for (const site of sites) {
    const totalsForSite: TotalsForSitePerCycleType = {
      ["Natural/Investigative"]: 0,
      ["IC + Ovulation induction"]: 0,
      ["IUI + Ovulation induction"]: 0,
      ["IUI Natural cycle"]: 0,
      ["IVF antagonist"]: 0,
      ["IVF down regulation"]: 0,
      ["IVF flare up"]: 0,
      ["IVF sandwich"]: 0,
      ["IVF duostim"]: 0,
      ["FET natural cycle, no trigger"]: 0,
      ["FET natural cycle + trigger"]: 0,
      ["FET estrace + progesterone"]: 0,
      ["FET down regulation"]: 0,
      ["Oocyte thaw (own oocytes)"]: 0,
      ["Oocyte thaw (donor oocytes)"]: 0,
      ["Oocyte cryopreservation"]: 0,
      ["Split Fertilization - Oocyte cryopreservation"]: 0,
    };
    for (let i = 0; i < cycleTypes.length; i++) {
      const response: number = await xanoGet(
        "/dashboard/cycle_type_range_site",
        "admin",
        {
          cycle_type: cycleTypes[i],
          range_start: rangeStart,
          range_end: rangeEnd,
          site_id: site.id,
        }
      );
      totalsForSite[cycleTypes[i]] = response;
    }
    totals = [...totals, totalsForSite];
  }

  const totalNatural = totals.reduce((acc, current) => {
    return acc + current["Natural/Investigative"];
  }, 0);
  const totalIC = totals.reduce((acc, current) => {
    return acc + current["IC + Ovulation induction"];
  }, 0);
  const totalIUI = totals.reduce((acc, current) => {
    return acc + current["IUI + Ovulation induction"];
  }, 0);
  const totalIUINatural = totals.reduce((acc, current) => {
    return acc + current["IUI Natural cycle"];
  }, 0);
  const totalIVFAntagonist = totals.reduce((acc, current) => {
    return acc + current["IVF antagonist"];
  }, 0);
  const totalIVFDownReg = totals.reduce((acc, current) => {
    return acc + current["IVF down regulation"];
  }, 0);
  const totalIVFFlare = totals.reduce((acc, current) => {
    return acc + current["IVF flare up"];
  }, 0);
  const totalIVFSandwich = totals.reduce((acc, current) => {
    return acc + current["IVF sandwich"];
  }, 0);
  const totalIVFDuostim = totals.reduce((acc, current) => {
    return acc + current["IVF duostim"];
  }, 0);
  const totalFETNaturalNoTrigger = totals.reduce((acc, current) => {
    return acc + current["FET natural cycle, no trigger"];
  }, 0);
  const totalFETNaturalTrigger = totals.reduce((acc, current) => {
    return acc + current["FET natural cycle + trigger"];
  }, 0);
  const totalFETEstrace = totals.reduce((acc, current) => {
    return acc + current["FET estrace + progesterone"];
  }, 0);
  const totalFETDownReg = totals.reduce((acc, current) => {
    return acc + current["FET down regulation"];
  }, 0);
  const totalOocyteThawOwn = totals.reduce((acc, current) => {
    return acc + current["Oocyte thaw (own oocytes)"];
  }, 0);
  const totalOocyteThawDonor = totals.reduce((acc, current) => {
    return acc + current["Oocyte thaw (donor oocytes)"];
  }, 0);
  const totalOocyteCryo = totals.reduce((acc, current) => {
    return acc + current["Oocyte cryopreservation"];
  }, 0);
  const totalSplitFertilization = totals.reduce((acc, current) => {
    return acc + current["Split Fertilization - Oocyte cryopreservation"];
  }, 0);

  return [
    ...totals,
    {
      ["Natural/Investigative"]: totalNatural,
      ["IC + Ovulation induction"]: totalIC,
      ["IUI + Ovulation induction"]: totalIUI,
      ["IUI Natural cycle"]: totalIUINatural,
      ["IVF antagonist"]: totalIVFAntagonist,
      ["IVF down regulation"]: totalIVFDownReg,
      ["IVF flare up"]: totalIVFFlare,
      ["IVF sandwich"]: totalIVFSandwich,
      ["IVF duostim"]: totalIVFDuostim,
      ["FET natural cycle, no trigger"]: totalFETNaturalNoTrigger,
      ["FET natural cycle + trigger"]: totalFETNaturalTrigger,
      ["FET estrace + progesterone"]: totalFETEstrace,
      ["FET down regulation"]: totalFETDownReg,
      ["Oocyte thaw (own oocytes)"]: totalOocyteThawOwn,
      ["Oocyte thaw (donor oocytes)"]: totalOocyteThawDonor,
      ["Oocyte cryopreservation"]: totalOocyteCryo,
      ["Split Fertilization - Oocyte cryopreservation"]:
        totalSplitFertilization,
    },
  ];
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
