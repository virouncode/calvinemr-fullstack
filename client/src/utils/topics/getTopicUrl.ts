export const getTopicUrl = (topic: string) => {
  switch (topic) {
    case "PAST HEALTH":
      return "/past_health_of_patient";
    case "FAMILY HISTORY":
      return "/family_history_of_patient";
    case "RELATIONSHIPS":
      return "/relationships_of_patient";
    case "ALERTS & SPECIAL NEEDS":
      return "/alerts_of_patient";
    case "RISK FACTORS":
      return "/risk_factors_of_patient";
    case "MEDICATIONS & TREATMENTS":
      return "/medications_of_patient";
    case "PAST PRESCRIPTIONS":
      return "/prescriptions_of_patient";
    case "PHARMACIES":
      return "/pharmacies";
    case "E-FORMS":
      return "/eforms_of_patient";
    case "REMINDERS":
      return "/reminders_of_patient";
    case "LETTERS/REFERRALS":
      return "/letters_of_patient";
    case "GROUPS":
      return "/groups_of_patient";
    case "PERSONAL HISTORY":
      return "/personal_history_of_patient";
    case "CARE ELEMENTS":
      return "/care_elements_of_patient";
    case "PROBLEM LIST":
      return "/problemlist_of_patient";
    case "PREGNANCIES":
      return "/pregnancies_of_patient";
    case "CYCLES":
      return "/cycles_of_patient";
    case "ALLERGIES & ADVERSE REACTIONS":
      return "/allergies_of_patient";
    case "REPORTS":
      return "/reports_of_patient";
    case "IMMUNIZATIONS":
      return "/immunizations_of_patient";
    case "APPOINTMENTS":
      return "/appointments_of_patient";
    case "MESSAGES ABOUT PATIENT":
      return "/messages_about_patient";
    case "MESSAGES WITH PATIENT":
      return "/messages_external_of_patient";
    case "TO-DOS ABOUT PATIENT":
      return "/todos_about_patient";
    default:
      return "/past_health_of_patient";
  }
};

export const getTopicUrlMutation = (topic: string) => {
  switch (topic) {
    case "PAST HEALTH":
      return "/past_health";
    case "FAMILY HISTORY":
      return "/family_history";
    case "RELATIONSHIPS":
      return "/relationships";
    case "ALERTS & SPECIAL NEEDS":
      return "/alerts";
    case "RISK FACTORS":
      return "/risk_factors";
    case "MEDICATIONS & TREATMENTS":
      return "/medications";
    case "PAST PRESCRIPTIONS":
      return "/prescriptions";
    case "PHARMACIES":
      return "/pharmacies";
    case "E-FORMS":
      return "/eforms";
    case "REMINDERS":
      return "/reminders";
    case "LETTERS/REFERRALS":
      return "/letters";
    case "GROUPS":
      return "/groups";
    case "PERSONAL HISTORY":
      return "/personal_history";
    case "CARE ELEMENTS":
      return "/care_elements";
    case "PROBLEM LIST":
      return "/problemlist";
    case "PREGNANCIES":
      return "/pregnancies";
    case "CYCLES":
      return "/cycles";
    case "ALLERGIES & ADVERSE REACTIONS":
      return "/allergies";
    case "REPORTS":
      return "/reports";
    case "IMMUNIZATIONS":
      return "/immunizations";
    case "APPOINTMENTS":
      return "/appointments";
    default:
      return "/past_health";
  }
};
