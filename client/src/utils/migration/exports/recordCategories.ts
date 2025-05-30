import { XMLExportFunctionType } from "../../../types/api";
import {
  toXmlAlerts,
  toXmlAllergies,
  toXmlAppointments,
  toXmlCareElements,
  toXmlClinicalNotes,
  toXmlDemographics,
  toXmlFamHistory,
  toXmlImmunizations,
  toXmlMedications,
  toXmlPastHealth,
  toXmlPersonalHistory,
  toXmlPregnancies,
  toXmlProblemList,
  toXmlRelationships,
  toXmlReports,
  toXmlRiskFactors,
} from "./xmlTemplates";

export const recordCategories: {
  id: number;
  name: string;
  label: string;
  url: string;
  template: XMLExportFunctionType;
}[] = [
  {
    id: 1,
    name: "Demographics",
    label: "Demographics",
    url: "/export/demographics",
    template: toXmlDemographics,
  },
  {
    id: 2,
    name: "PersonalHistory",
    label: "Personal History",
    url: "/export/personal_history",
    template: toXmlPersonalHistory,
  },
  {
    id: 3,
    name: "FamilyHistory",
    label: "Family History",
    url: "/export/family_history",
    template: toXmlFamHistory,
  },
  {
    id: 4,
    name: "PastHealth",
    label: "Past Health",
    url: "/export/past_health",
    template: toXmlPastHealth,
  },
  {
    id: 5,
    name: "ProblemList",
    label: "Problem List",
    url: "/export/problem_list",
    template: toXmlProblemList,
  },
  {
    id: 6,
    name: "RiskFactors",
    label: "Risk Factors",
    url: "/export/risk_factors",
    template: toXmlRiskFactors,
  },
  {
    id: 7,
    name: "AllergiesAndAdverseReactions",
    label: "Allergies & Adverse Reactions",
    url: "/export/allergies",
    template: toXmlAllergies,
  },
  {
    id: 8,
    name: "MedicationsAndTreatments",
    label: "Medications & Treatments",
    url: "/export/medications",
    template: toXmlMedications,
  },
  {
    id: 9,
    name: "Immunizations",
    label: "Immunizations",
    url: "/export/immunizations",
    template: toXmlImmunizations,
  },
  // {
  //   id: 10,
  //   name: "LaboratoryResults",
  //   label: "Laboratory Results",
  //   url: "/export/laboratory_results",
  //   template: toXmlLabResults,
  // },
  {
    id: 11,
    name: "Appointments",
    label: "Appointments",
    url: "/export/appointments",
    template: toXmlAppointments,
  },
  {
    id: 12,
    name: "ClinicalNotes",
    label: "Clinical Notes",
    url: "/export/clinical_notes",
    template: toXmlClinicalNotes,
  },
  {
    id: 13,
    name: "Reports",
    label: "Reports",
    url: "/export/reports",
    template: toXmlReports,
  },
  {
    id: 14,
    name: "CareElements",
    label: "Care Elements",
    url: "/export/care_elements",
    template: toXmlCareElements,
  },
  {
    id: 15,
    name: "AlertsAndSpecialNeeds",
    label: "Alerts & Special Needs",
    url: "/export/alerts",
    template: toXmlAlerts,
  },
  {
    id: 16,
    name: "Pregnancies",
    label: "Pregnancies",
    url: "export/pregnancies",
    template: toXmlPregnancies,
  },
  {
    id: 17,
    name: "Relationships",
    label: "Relationships",
    url: "export/relationships",
    template: toXmlRelationships,
  },
];
