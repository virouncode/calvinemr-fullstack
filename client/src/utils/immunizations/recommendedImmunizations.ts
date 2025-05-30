import {
  RecImmunizationAgeType,
  RecImmunizationDoseType,
  RecImmunizationRouteType,
  RecImmunizationTypeListType,
} from "../../types/api";

export const recommendedImmunizationsList: {
  id: number;
  type: RecImmunizationTypeListType;
  dose: RecImmunizationDoseType;
  route: RecImmunizationRouteType;
  ages: RecImmunizationAgeType[];
}[] = [
  {
    id: 1,
    type: "DTaP-IPV-Hib",
    dose: "single",
    route: "Intramuscular",
    ages: ["2 Months", "4 Months", "6 Months", "18 Months"],
  },
  {
    id: 2,
    type: "Pneu-C-7",
    dose: "single",
    route: "Intramuscular",
    ages: ["2 Months", "4 Months", "1 Year"],
  },
  {
    id: 3,
    type: "ROT",
    dose: "single",
    route: "Oral",
    ages: ["2 Months", "4 Months"],
  },
  {
    id: 4,
    type: "Men-C",
    dose: "single",
    route: "Intramuscular",
    ages: ["1 Year"],
  },
  {
    id: 5,
    type: "MMR",
    dose: "single",
    route: "Subcutaneous",
    ages: ["1 Year"],
  },
  {
    id: 6,
    type: "Var",
    dose: "single",
    route: "Subcutaneous",
    ages: ["15 Months"],
  },
  {
    id: 7,
    type: "MMR-Var",
    dose: "single",
    route: "Subcutaneous",
    ages: ["4 Years"],
  },
  {
    id: 8,
    type: "TdapIPV",
    dose: "single",
    route: "Intramuscular",
    ages: ["4 Years"],
  },
  {
    id: 9,
    type: "HB",
    dose: "double",
    route: "Intramuscular",
    ages: ["Grade 7"],
  },
  {
    id: 10,
    type: "Men-C",
    dose: "single",
    route: "Intramuscular",
    ages: ["Grade 7"],
  },
  {
    id: 11,
    type: "HPV",
    dose: "double",
    route: "Intramuscular",
    ages: ["Grade 7"],
  },
  {
    id: 12,
    type: "Tdap",
    dose: "single",
    route: "Intramuscular",
    ages: ["14 Years"],
  },
  {
    id: 13,
    type: "Td",
    dose: "multiple",
    route: "Intramuscular",
    ages: [">=34 Years"],
  },
  {
    id: 14,
    type: "Zos",
    dose: "double",
    route: "Intramuscular",
    ages: ["65 Years"],
  },
  {
    id: 15,
    type: "Pneu-P-23",
    dose: "single",
    route: "Intramuscular/Subcutaneous",
    ages: ["65 Years"],
  },
  {
    id: 16,
    type: "Tdap_pregnancy",
    dose: "multiple",
    route: "Intramuscular",
    ages: ["Grade 7"],
  },
  {
    id: 17,
    type: "Inf",
    dose: "multiple",
    route: "Intramuscular",
    ages: ["6 Months"],
  },
];
