import { ChecklistType } from "../../types/api";
export const tests = [
  {
    name: "Folic acid intake (ask patient periodically)",
    defaultValidity: { days: 0, weeks: 0, months: 3, years: 0 },
  },
  {
    name: "HIV 1 AND 2",
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
];

export const splitResults = (datas: ChecklistType[]) => {
  return tests.map(({ name }) =>
    datas
      .filter((data) => data.test_name === name)
      .sort((a, b) => b.date - a.date)
  );
};
