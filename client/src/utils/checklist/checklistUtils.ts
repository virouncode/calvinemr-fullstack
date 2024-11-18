import { DateTime } from "luxon";
import { ChecklistType } from "../../types/api";

export const checklistTests = [
  {
    name: "Folic acid intake (ask patient periodically)",
    defaultValidity: { days: 0, weeks: 0, months: 3, years: 0 },
  },
  {
    name: "HIV 1 and 2",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "HTLV 1 and 2",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "HBs Antigen",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Hepatitis C serology",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  { name: "VDRL", defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 } },
  {
    name: "CMV IgG",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Varicella IgG",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Parvovirus B19 IgG",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Rubella IgG",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Chlamydia PCR urine",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Gonorrhea PCR urine",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  { name: "Blood type", defaultValidity: null },
  { name: "Rhesus", defaultValidity: null },
  { name: "CBC", defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 } },
  { name: "Hemoglobin electrophoresis", defaultValidity: null },
  {
    name: "HbA1c",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Testosterone",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  { name: "SHBG", defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 } },
  {
    name: "Albumin",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "DHEAS",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Lipid profile",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Mammogram",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 2 },
  },
  {
    name: "Pap test",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 3 },
  },
  {
    name: "HPV test",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 3 },
  },
  { name: "Caryotype", defaultValidity: null },
  { name: "Y-chromosome micro-deletions", defaultValidity: null },
  {
    name: "Lupus anticoagulant",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Anti-cardiolipin antibodies",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Anti Beta-2 glycoprotein I",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  { name: "TSH", defaultValidity: { days: 0, weeks: 0, months: 3, years: 0 } },
  { name: "PRL", defaultValidity: { days: 0, weeks: 0, months: 3, years: 0 } },
  {
    name: "Anti-Mullerian Hormone (pmol/L)",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Pelvic ultrasound - uterus / fibroids",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Pelvic ultrasound - right ovary",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Pelvic ultrasound - right AFC",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Pelvic ultrasound - left ovary",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Pelvic ultrasound - left AFC",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Sonohysterogram - uterine cavity",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Sonohysterogram - left tube",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Sonohysterogram - right tube",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Dye test - uterine cavity",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Dye test - left tube",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Dye test - right tube",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Endometrial biopsy - pathology",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Endometrial biopsy - CD138/Plasmocytes",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Semen analysis - Volume (mL)",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Semen analysis - Concentration (million/mL)",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Semen analysis - Progressive motility (%)",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Semen analysis - Total Motile count",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Semen analysis - Normal Morphology Kruger (%)",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Semen analysis - Normal Morphology non Kruger (%)",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Sperm DNA fragmentation (%)",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Scrotal ultrasound",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  { name: "Extended Carrier Screening", defaultValidity: null },
  { name: "Cystic fibrosis testing", defaultValidity: null },
  {
    name: "Toxicology",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "Colonoscopy/Sigmoidoscopy",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 10 },
  },
  {
    name: "Hemoccult Multiphase FOBT/FIT",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 2 },
  },
  {
    name: "Bone Mineral Density",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  {
    name: "CT-scan",
    defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 },
  },
  { name: "MRI", defaultValidity: { days: 0, weeks: 0, months: 0, years: 1 } },
  {
    name: "HIV 1 and 2 <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "HTLV 1 and 2 <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "HBs Antigen <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Hepatitis C serology <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "VDRL <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "CMV IgG <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Chlamydia PCR urine <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Gonorrhea PCR urine <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  { name: "Blood type <partner>", defaultValidity: null },
  { name: "Rhesus <partner>", defaultValidity: null },
  {
    name: "CBC <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  { name: "Hemoglobin electrophoresis <partner>", defaultValidity: null },
  {
    name: "Testosterone <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "SHBG <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "Albumin <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
  {
    name: "DHEAS <partner>",
    defaultValidity: { days: 0, weeks: 0, months: 6, years: 0 },
  },
];

export const getLimitDate = (
  dateOfTest: number,
  validity: { days: number; weeks: number; months: number; years: number }
) => {
  const parsedValidity = validity
    ? {
        days: isNaN(validity.days) ? 0 : validity.days,
        weeks: isNaN(validity.weeks) ? 0 : validity.weeks,
        months: isNaN(validity.months) ? 0 : validity.months,
        years: isNaN(validity.years) ? 0 : validity.years,
      }
    : { days: 0, weeks: 0, months: 0, years: 0 };
  if (
    !dateOfTest ||
    !validity ||
    (parsedValidity.days === 0 &&
      parsedValidity.weeks === 0 &&
      parsedValidity.months === 0 &&
      parsedValidity.years === 0)
  )
    return "N/A";
  const dateOfTestLuxon = DateTime.fromMillis(dateOfTest, {
    zone: "America/Toronto",
  });
  const limitDateLuxon = dateOfTestLuxon.plus(parsedValidity);
  return limitDateLuxon.toFormat("yyyy-MM-dd");
};

export const isTestExpired = (
  dateOfTest: number,
  validity: { days: number; weeks: number; months: number; years: number }
) => {
  const parsedValidity = validity
    ? {
        days: isNaN(validity.days) ? 0 : validity.days,
        weeks: isNaN(validity.weeks) ? 0 : validity.weeks,
        months: isNaN(validity.months) ? 0 : validity.months,
        years: isNaN(validity.years) ? 0 : validity.years,
      }
    : { days: 0, weeks: 0, months: 0, years: 0 };
  if (
    !dateOfTest ||
    !validity ||
    (parsedValidity.days === 0 &&
      parsedValidity.weeks === 0 &&
      parsedValidity.months === 0 &&
      parsedValidity.years === 0)
  )
    return "N/A";
  const dateOfTestLuxon = DateTime.fromMillis(dateOfTest, {
    zone: "America/Toronto",
  });
  const limitDateLuxon = dateOfTestLuxon.plus(parsedValidity);
  const nowLuxon = DateTime.now().setZone("America/Toronto");
  return nowLuxon > limitDateLuxon ? "Y" : "N";
};

export const toValidityText = (validity: {
  days: number;
  weeks: number;
  months: number;
  years: number;
}) => {
  const parsedValidity = validity
    ? {
        days: isNaN(validity.days) ? 0 : validity.days,
        weeks: isNaN(validity.weeks) ? 0 : validity.weeks,
        months: isNaN(validity.months) ? 0 : validity.months,
        years: isNaN(validity.years) ? 0 : validity.years,
      }
    : { days: 0, weeks: 0, months: 0, years: 0 };
  if (
    !validity ||
    (parsedValidity.days === 0 &&
      parsedValidity.weeks === 0 &&
      parsedValidity.months === 0 &&
      parsedValidity.years === 0)
  )
    return "N/A";
  const daysText = parsedValidity.days
    ? parsedValidity.days === 1
      ? `${parsedValidity.days} day`
      : `${parsedValidity.days} days`
    : "";
  const weeksText = parsedValidity.weeks
    ? parsedValidity.weeks === 1
      ? `${parsedValidity.weeks} week`
      : `${parsedValidity.weeks} weeks`
    : "";
  const monthsText = parsedValidity.months
    ? parsedValidity.months === 1
      ? `${parsedValidity.months} month`
      : `${parsedValidity.months} months`
    : "";
  const yearsText = parsedValidity.years
    ? parsedValidity.years === 1
      ? `${parsedValidity.years} year`
      : `${parsedValidity.years} years`
    : "";

  const validTexts = [yearsText, monthsText, weeksText, daysText]
    .filter((text) => text)
    .join(" ");

  return validTexts;
};

export const splitChecklistResults = (datas: ChecklistType[]) => {
  return checklistTests.map(({ name }) =>
    datas
      .filter((data) => data.test_name === name)
      .sort((a, b) => b.date - a.date)
  );
};
