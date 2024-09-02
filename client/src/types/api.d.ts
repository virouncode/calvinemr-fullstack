//XANO API Types
export type AdminType = {
  id: number;
  date_created: number;
  email: string;
  password: string;
  access_level: "admin";
  temp_login: { temp_password: string; expiration: number; used: boolean };
  first_name: string;
  last_name: string;
  full_name: string;
  updates: { date_updated: number }[];
  pin: string;
  autolock_time_min: number;
  title: string;
};

export type AlertType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  AlertDescription: string;
  Notes: string;
  DateActive: number | null;
  EndDate: number | null;
};

export type AlertFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  AlertDescription: string;
  Notes: string;
  DateActive: number | null;
  EndDate: number | null;
};

export type AllergyType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  OffendingAgentDescription: string;
  PropertyOfOffendingAgent: string;
  Code: { CodeType: string; CodeValue: string };
  ReactionType: string;
  StartDate: number | null;
  LifeStage: string;
  Severity: string;
  Reaction: string;
  RecordedDate: number;
  Notes: string;
};

export type AllergyFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  OffendingAgentDescription: string;
  PropertyOfOffendingAgent: string;
  ReactionType: string;
  StartDate: number | null;
  LifeStage: string;
  Severity: string;
  Reaction: string;
  RecordedDate: number;
  Notes: string;
};

export type AppointmentType = {
  id: number;
  host_id: number;
  date_created: number;
  created_by_id: number;
  start: number;
  end: number;
  patients_guests_ids: number[] | { patient_infos: DemographicsType }[];
  staff_guests_ids: number[] | { staff_infos: StaffType }[];
  room_id: string;
  all_day: boolean;
  updates: { updated_by_id: number; date_updated: number }[];
  AppointmentTime: string;
  Duration: number;
  AppointmentStatus: string;
  AppointmentDate: string;
  Provider: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
  };
  AppointmentPurpose: string;
  AppointmentNotes: string;
  site_id: number;
  rrule: RruleType;
  exrule: ExruleType;
  recurrence: string;
  //add-ons
  site_infos?: SiteType;
  host_infos?: StaffType;
};

export type AppointmentFormType = {
  host_id: number;
  date_created: number;
  created_by_id: number;
  start: number;
  end: number;
  patients_guests_ids: number[];
  room_id: string;
  all_day: boolean;
  AppointmentTime: string;
  Duration: number;
  AppointmentStatus: string;
  AppointmentDate: string;
  Provider: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
  };
  AppointmentPurpose: string;
  AppointmentNotes: string;
  site_id: number;
  rrule: RruleType;
  exrule: ExruleType;
  recurrence: string;
};

export type RruleType = {
  freq: string;
  interval: number;
  dtstart: string;
  until: string;
};

export type ExruleType = {
  freq: string;
  interval: number;
  dtstart: string;
  until: string;
}[];

export type AttachmentType = {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: {
    width: number;
    height: number;
  };
  url: string;
};
export type ScheduleType = {
  monday: { hours: string; min: string; ampm: "AM" | "PM" }[];
  tuesday: { hours: string; min: string; ampm: "AM" | "PM" }[];
  wednesday: { hours: string; min: string; ampm: "AM" | "PM" }[];
  thursday: { hours: string; min: string; ampm: "AM" | "PM" }[];
  friday: { hours: string; min: string; ampm: "AM" | "PM" }[];
  saturday: { hours: string; min: string; ampm: "AM" | "PM" }[];
  sunday: { hours: string; min: string; ampm: "AM" | "PM" }[];
};
export type UnavailabilityType = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};
export type AvailabilityType = {
  id: number;
  staff_id: number;
  schedule_morning: ScheduleType;
  schedule_afternoon: ScheduleType;
  unavailability: UnavailabilityType;
  default_duration_hours: number;
  default_duration_min: number;
  date_created: number;
};

export type BillingCodeTemplateType = {
  id: number;
  name: string;
  author_id: number;
  date_created: number;
  billing_codes: string[];
};

export type BillingType = {
  id: number;
  date: number;
  date_created: number;
  provider_id: number;
  referrer_ohip_billing_nbr: string;
  patient_id: number;
  diagnosis_id: number;
  billing_code_id: number;
  updates: {
    updated_by_id: number;
    date_updated: number;
    updated_by_user_type: string;
  }[];
  site_id: number;
  created_by_id: number;
  created_by_user_type: "staff" | "admin";
  billing_code_suffix: string;
  //add-ons
  site_infos?: SiteType;
  patient_infos?: DemographicsType;
  billing_infos?: {
    billing_code: string;
    provider_fee: number;
    assistant_fee: number;
    specialist_fee: number;
    anaesthetist_fee: number;
    non_anaesthetist_fee: number;
  };
  diagnosis_name?: { diagnosis: string };
  provider_ohip_billing_nbr?: { ohip_billing_nbr: string };
  diagnosis_code?: { code: number };
};

export type BillingFormType = {
  dateStr: string;
  provider_ohip_billing_nbr: string;
  referrer_ohip_billing_nbr: string;
  patient_id: number;
  patient_hcn: string;
  patient_name: string;
  diagnosis_code: string | number;
  billing_codes: string;
  site_id: number;
};

export type CalvinAITemplateType = {
  id: number;
  author_id: number;
  name: string;
  date_created: number;
  prompt: string;
};

export type CareElementType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  SmokingStatus: { Status: string; Date: number }[];
  SmokingPacks: { PerDay: string; Date: number }[];
  Weight: { Weight: string; WeightUnit: "kg"; Date: number }[];
  Height: { Height: string; HeightUnit: "cm"; Date: number }[];
  WaistCircumference: {
    WaistCircumference: string;
    WaistCircumferenceUnit: "cm";
    Date: number;
  }[];
  BloodPressure: {
    SystolicBP: string;
    DiastolicBP: string;
    BPUnit: "mmHg";
    Date: number;
  }[];
  DiabetesComplicationsScreening: { ExamCode: string; Date: number }[];
  DiabetesMotivationalCounselling: {
    CounsellingPerformed: string;
    Date: number;
  }[];
  DiabetesSelfManagementCollaborative: {
    CodeValue: string;
    DocumentedGoals: string;
    Date: number;
  }[];
  DiabetesSelfManagementChallenges: {
    CodeValue: string;
    ChallengesIdentified: string;
    Date: number;
  }[];
  DiabetesEducationalSelfManagement: {
    EducationalTrainingPerformed: string;
    Date: number;
  }[];
  HypoglycemicEpisodes: {
    NumOfReportedEpisodes: number;
    Date: number;
  }[];
  SelfMonitoringBloodGlucose: { SelfMonitoring: string; Date: number }[];
  bodyMassIndex: { BMI: string; Date: number }[];
  bodySurfaceArea: { BSA: string; Date: number }[];
  Additional: CareElementAdditionalType[];
};

export type CareElementAdditionalType = {
  Unit: string;
  Name: string;
  Data: { Value: string; Date: number }[];
};

export type CareElementAdditionalFormType = {
  Unit: string;
  Name: string;
  Data: { Value: string; Date: number };
}[];

export type CareElementLastDatasType = {
  SmokingStatus: { Status: string; Date: number | null };
  SmokingPacks: { PerDay: string; Date: number | null };
  Weight: {
    Weight: string;
    WeightUnit: "kg";
    Date: number | null;
  };
  Height: {
    Height: string;
    HeightUnit: "cm";
    Date: number | null;
  };
  WaistCircumference: {
    WaistCircumference: string;
    WaistCircumferenceUnit: "cm";
    Date: number | null;
  };
  BloodPressure: {
    SystolicBP: string;
    DiastolicBP: string;
    BPUnit: "mmHg";
    Date: number | null;
  };
  bodyMassIndex: { BMI: string; Date: number | null };
  bodySurfaceArea: { BSA: string; Date: number | null };
};

export type CareElementFormType = {
  patient_id: number;
  SmokingStatus: { Status: string; Date: number };
  SmokingPacks: { PerDay: string; Date: number };
  Weight: { Weight: string; WeightUnit: "kg"; Date: number };
  WeightLbs: { Weight: string; WeightUnit: "lbs"; Date: number };
  Height: { Height: string; HeightUnit: "cm"; Date: number };
  HeightFeet: { Height: string; HeightUnit: "feet"; Date: number };
  WaistCircumference: {
    WaistCircumference: string;
    WaistCircumferenceUnit: "cm";
    Date: number;
  };
  BloodPressure: {
    SystolicBP: string;
    DiastolicBP: string;
    BPUnit: "mmHg";
    Date: number;
  };
  DiabetesComplicationsScreening: { ExamCode: string; Date: number }[];
  DiabetesMotivationalCounselling: {
    CounsellingPerformed: string;
    Date: number;
  };
  DiabetesSelfManagementCollaborative: {
    CodeValue: string;
    DocumentedGoals: string;
    Date: number;
  };
  DiabetesSelfManagementChallenges: {
    CodeValue: string;
    ChallengesIdentified: string;
    Date: number;
  };
  DiabetesEducationalSelfManagement: {
    EducationalTrainingPerformed: string;
    Date: number;
  };
  HypoglycemicEpisodes: {
    NumOfReportedEpisodes: number;
    Date: number;
  };
  SelfMonitoringBloodGlucose: { SelfMonitoring: string; Date: number };
  bodyMassIndex: { BMI: string; Date: number };
  bodySurfaceArea: { BSA: string; Date: number };
};

export type ClinicType = {
  id: number;
  date_created: number;
  name: string;
  email: string;
  website: string;
  updates: { updated_by_id: number; date_updated: number }[];
};

export type ClinicalNoteType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  NoteType: string;
  subject: string;
  MyClinicalNotesContent: string;
  EventDateTime: number | null;
  ParticipatingProviders: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
    DateTimeNoteCreated: number;
  }[];
  NoteReviewer: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
    DateTimeNoteReviewed: number;
  }[];
  version_nbr: number;
  attachments_ids: number[] | { attachment: ClinicalNoteAttachmentType }[];
  date_updated: number;
  //Add-on
  versions?: ClinicalNoteLogType[];
};

export type ClinicalNoteFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  subject: string;
  MyClinicalNotesContent: string;
  ParticipatingProviders: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
    DateTimeNoteCreated: number;
  }[];
  version_nbr: 1;
  attachments_ids: number[] | { attachment: ClinicalNoteAttachmentType }[];
};

export type ClinicalNoteAttachmentType = {
  id: number | string;
  file: AttachmentType;
  alias: string;
  date_created: number;
  created_by_id: number;
};

export type ClinicalNoteLogType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  NoteType: string;
  subject: string;
  MyClinicalNotesContent: string;
  EventDateTime: number | null;
  ParticipatingProviders: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
    DateTimeNoteCreated: number;
  }[];
  NoteReviewer: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
    DateTimeNoteReviewed: number;
  }[];
  version_nbr: number;
  clinical_note_id: number;
  date_updated: number;
};

export type ClinicalNoteTemplateType = {
  id: number;
  name: string;
  author_id: number;
  body: string;
  date_created: number;
};

export type ClinicalNoteTemplateFormType = {
  name: string;
  author_id: number;
  body: string;
  date_created: number;
};

export type CycleType = {
  id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  cycle_length: string;
  menstruation_length: string;
  etiology: string;
  amh: string;
  partner_sperm: boolean;
  donor_sperm_nbr: string;
  lmp: number | null;
  ohip_funded: boolean;
  cancelled: boolean;
  cycle_type: string;
  third_party: string;
  prewash_concentration: string;
  prewash_motility: string;
  postwash_motility: string;
  postwash_total_motile_sperm: string;
  test_blood_type_female: string;
  test_blood_type_male: string;
  test_hiv_female: string;
  test_hiv_male: string;
  test_hep_b_female: string;
  test_hep_b_male: string;
  test_hep_c_female: string;
  test_hep_c_male: string;
  test_syphilis_female: string;
  test_syphilis_male: string;
  test_cmv_female: string;
  test_cmv_male: string;
  test_sonohysterogram_female: string;
  test_endo_bx_female: string;
  patient_id: number;
  cycle_nbr: string;
  events: CycleEventType[];
  notes: CycleNoteType[];
  cycle_notes: string;
  status: string;
};

export type CycleNoteType = { temp_id?: string; text: string; date: number };

export type CycleEventType = {
  temp_id?: string;
  date: number | null;
  day_of_cycle: string;
  endometrial_thickness: string;
  left_follicles: string;
  right_follicles: string;
  med_1: { name: string; notes: string };
  med_2: { name: string; notes: string };
  med_3: { name: string; notes: string };
  med_4: { name: string; notes: string };
  med_5: { name: string; notes: string };
  med_6: { name: string; notes: string };
  med_7: { name: string; notes: string };
  e2: string;
  lh: string;
  p4: string;
};

export type CycleMedNumberType =
  | "med_1"
  | "med_2"
  | "med_3"
  | "med_4"
  | "med_5"
  | "med_6"
  | "med_7";

export type EmergencyContactType = {
  ContactPurpose: { PurposeAsEnum: string; PurposeAsPlainText: string };
  Name: { FirstName: string; MiddleName: string; LastName: string };
  EmailAddress: string;
  Note: string;
  PhoneNumber: {
    areaCode: string;
    number: string;
    extension: string;
    exchange: string;
    phoneNumber: string;
    _phoneNumberType: string;
  }[];
};

export type EnrolmentHistoryType = {
  EnrollmentStatus: string;
  EnrollmentDate: number | null;
  EnrollmentTerminationDate: number | null;
  TerminationReason: string;
  EnrolledToPhysician: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
  };
};

export type DemographicsType = {
  id: number;
  patient_id: number;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
  avatar: AttachmentType | null;
  assigned_staff_id: number;
  Names: {
    NamePrefix: string;
    LegalName: {
      FirstName: { Part: string; PartType: string; PartQualifier: string };
      LastName: { Part: string; PartType: string; PartQualifier: string };
      OtherName: { Part: string; PartType: string; PartQualifier: string }[];
      _namePurpose: string;
    };
    OtherNames: {
      OtherName: { Part: string; PartType: string; PartQualifier: string }[];
      _namePurpose: string;
    }[];
    LastNameSuffix: string;
  };
  DateOfBirth: number | null;
  HealthCard: {
    Number: string;
    Version: string;
    ExpiryDate: number | null;
    ProvinceCode: string;
  };
  ChartNumber: string;
  DateOfBirthISO: string;
  Gender: string;
  Address: {
    Structured: {
      Line1: string;
      Line2: string;
      Line3: string;
      City: string;
      CountrySubDivisionCode: string;
      PostalZipCode: { PostalCode: string; ZipCode: string };
    };
    _addressType: string;
  }[];
  PhoneNumber: {
    extension: string;
    phoneNumber: string;
    _phoneNumberType: string;
  }[];
  PreferredOfficialLanguage: string;
  PreferredSpokenLanguage: string;
  Contact: EmergencyContactType[];
  NoteAboutPatient: string;
  Enrolment: {
    EnrolmentHistory: EnrolmentHistoryType[];
  };
  PrimaryPhysician: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
    PrimaryPhysicianCPSO: string;
  };
  Email: string;
  PersonStatusCode: {
    PersonStatusAsEnum: string;
    PersonStatusAsPlainText: string;
  };
  PersonStatusDate: number | null;
  SIN: string;
  ReferredPhysician: { FirstName: string; LastName: string };
  FamilyPhysician: { FirstName: string; LastName: string };
  PreferredPharmacy: number;
  ai_consent: boolean;
  ai_consent_read: boolean;
  //Add-ons
  preferred_pharmacy?: PharmacyType;
  patient_care_elements?: CareElementType;
};

export type DemographicsFormType = {
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  nickName: string;
  chart: string;
  dob: string;
  age: number | "";
  healthNbr: string;
  healthVersion: string;
  healthExpiry: string;
  healthProvince: string;
  gender: string;
  sin: string;
  email: string;
  cellphone: string;
  cellphoneExt: string;
  homephone: string;
  homephoneExt: string;
  workphone: string;
  workphoneExt: string;
  line1: string;
  province: string;
  postalCode: string;
  zipCode: string;
  city: string;
  preferredOff: string;
  status: string;
  assignedMd: number;
  enrolled: string; // A GERER
  pPhysicianFirstName: string;
  pPhysicianLastName: string;
  pPhysicianOHIP: string;
  pPhysicianCPSO: string;
  rPhysicianFirstName: string;
  rPhysicianLastName: string;
  fPhysicianFirstName: string;
  fPhysicianLastName: string;
  emergencyFirstName: string;
  emergencyMiddleName: string;
  emergencyLastName: string;
  emergencyEmail: string;
  emergencyPhone: string;
  avatar: AttachmentType | null;
};

export type DiagnosisType = {
  id: number;
  code: number;
  diagnosis: string;
  category: string;
};

export type DoctorType = {
  id: number;
  created_by_id: number;
  date_created: number;
  updates: {
    updated_by_id: number;
    date_updated: number;
    updated_by_user_type: string;
  }[];
  FirstName: string;
  LastName: string;
  Address: {
    Formatted?: string;
    Structured: {
      Line1: string;
      Line2?: string;
      Line3?: string;
      City: string;
      CountrySubDivisionCode: string;
      PostalZipCode: { PostalCode: string; ZipCode: string };
    };
    _addressType: string;
  };
  PhoneNumber: {
    areaCode?: string;
    number?: string;
    extension?: string;
    exchange?: string;
    phoneNumber: string;
    _phoneNumberType: string;
  }[];
  FaxNumber: {
    areaCode?: string;
    number?: string;
    extension?: string;
    exchange?: string;
    phoneNumber: string;
    _phoneNumberType: string;
  };
  EmailAddress: string;
  patients: number[];
  ohip_billing_nbr: string;
  speciality: string;
  licence_nbr: string;
};

export type DoctorFormType = {
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  zipCode: string;
  phone: string;
  fax: string;
  email: string;
  speciality: string;
  licence_nbr: string;
  ohip_billing_nbr: string;
  patients: number[];
};

export type EdocType = {
  id: number;
  date_created: number;
  created_by_id: number;
  file: AttachmentType | null;
  notes: string;
  name: string;
};

export type EdocFormType = {
  date_created: number;
  created_by_id: number;
  file: AttachmentType | null;
  notes: string;
  name: string;
};

export type EformType = {
  id: number;
  date_created: number;
  created_by_id: number;
  name: string;
  updates: { updated_by_id: number; date_updated: number }[];
  file: AttachmentType;
  patient_id: number;
};

export type EformBlankType = {
  id: number;
  name: string;
  file: AttachmentType;
  date_created: number;
};

export type FamilyHistoryType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  StartDate: number | null;
  AgeAtOnset: string;
  LifeStage: string;
  ProblemDiagnosisProcedureDescription: string;
  DiagnosisProcedureCode: {
    StandardCodingSystem: string;
    StandardCode: string;
    StandardCodeDescription: string;
  };
  Treatment: string;
  Relationship: string;
  Notes: string;
};

export type FamilyHistoryFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  StartDate: number | null;
  AgeAtOnset: string;
  LifeStage: string;
  ProblemDiagnosisProcedureDescription: string;
  Treatment: string;
  Relationship: string;
  Notes: string;
};

export type FaxContactType = {
  id: number;
  name: string;
  category: string;
  fax_number: string;
  date_created: number;
  created_by_id: number;
};

export type FaxTemplateType = {
  id: number;
  name: string;
  date_created: number;
  author_id: number;
  subject: string;
  body: string;
};

export type GroupType = {
  id: number;
  date_created: number;
  staff_id: number;
  patients: number[] | { patient_infos: DemographicsType }[];
  name: string;
  description: string;
  color: string;
  global: boolean;
};

export type GroupFormType = {
  date_created: number;
  staff_id: number;
  patients: { patient_infos: DemographicsType }[];
  name: string;
  description: string;
  color: string;
  global: boolean;
};

export type ImmunizationType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  ImmunizationName: string;
  ImmunizationType: string;
  Manufacturer: string;
  LotNumber: string;
  Route: string;
  Site: string;
  Dose: string;
  ImmunizationCode: {
    CodingSystem: string;
    value: string;
    Description: string;
  };
  Date: number | null;
  RefusedFlag: { ynIndicatorsimple: "Y" | "N" };
  Instructions: string;
  Notes: string;
  age: string;
  doseNumber: number;
  recommended: boolean;
};

export type ImmunizationFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  ImmunizationName: string;
  ImmunizationType: string;
  Manufacturer: string;
  LotNumber: string;
  Route: string;
  Site: string;
  Dose: string;
  Date: number | null;
  RefusedFlag: { ynIndicatorsimple: "Y" | "N" };
  Instructions: string;
  Notes: string;
  age: string;
  doseNumber: number;
  recommended: boolean;
};
const allImmunizationsAges = [
  "2 Months",
  "4 Months",
  "6 Months",
  "1 Year",
  "15 Months",
  "18 Months",
  "4 Years",
  "Grade 7",
  "14 Years",
  "24 Years",
  ">=34 Years",
  "65 Years",
] as const;

export type RecImmunizationAgeType = (typeof allImmunizationsAges)[number];

export type RecImmunizationDoseType = "single" | "double" | "multiple";

export type RecImmunizationRouteType =
  | "Intramuscular"
  | "Oral"
  | "Subcutaneous"
  | "Intramuscular/Subcutaneous";

export type RecImmunizationTypeListType =
  | "DTaP-IPV-Hib"
  | "Pneu-C-7"
  | "ROT"
  | "Men-C"
  | "MMR"
  | "Var"
  | "MMR-Var"
  | "TdapIPV"
  | "HB"
  | "Men-C"
  | "HPV"
  | "Tdap"
  | "Td"
  | "Zos"
  | "Pneu-P-23"
  | "Tdap_pregnancy"
  | "Inf";

export type LabLinkType = {
  id: number;
  date_created: number;
  name: string;
  url: string;
};

export type LabLinkCredentialsType = {
  id: number;
  date_created: number;
  lablink_id: number;
  login: string;
  pwd: string;
  staff_id: number;
};

export type LabLinkPersonalType = {
  id: number;
  staff_id: number;
  name: string;
  url: string;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  login: string;
  pwd: string;
};

export type LabLinkPersonalFormType = {
  staff_id: number;
  name: string;
  url: string;
  date_created: number;
  created_by_id: number;
  login: string;
  pwd: string;
};

export type LetterType = {
  id: number;
  date_created: number;
  created_by_id: number;
  patient_id: number;
  file: AttachmentType;
  name: string;
  description: string;
  updates: { date_updated: number; updated_by_id: number }[];
};

export type LetterFormType = {
  date_created: number;
  created_by_id: number;
  patient_id: number;
  file: AttachmentType;
  name: string;
  description: string;
};

export type LetterAttachmentType = {
  file: AttachmentType | null;
  alias: string;
  date_created: number;
  created_by_id: user.id;
  id: string;
  type: "attachment" | "report";
};

export type LetterTemplateType = {
  id: number;
  date_created: number;
  author_id: number;
  body: string;
  name: string;
  description: string;
  subject: string;
  recipient_infos: string;
};

export type LetterTemplateFormType = {
  date_created: number;
  author_id: number;
  body: string;
  name: string;
  description: string;
  subject: string;
  recipient_infos?: string;
};

export type LinkType = {
  id: number;
  staff_id: number;
  name: string;
  url: string;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
};

export type LinkFormType = {
  staff_id: number;
  name: string;
  url: string;
  date_created: number;
  created_by_id: number;
};

export type MedType = {
  id: number;
  temp_id?: string;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  PrescriptionWrittenDate: number | null;
  StartDate: number | null;
  DrugIdentificationNumber: string;
  DrugName: string;
  Strength: { Amount: string; UnitOfMeasure: string };
  NumberOfRefills: string;
  Dosage: string;
  DosageUnitOfMeasure: string;
  Form: string;
  Route: string;
  Frequency: string;
  Duration: string;
  RefillDuration: string;
  Quantity: string;
  RefillQuantity: string;
  LongTermMedication: { ynIndicatorsimple: string; boolean?: boolean };
  PastMedication: { ynIndicatorsimple: string; boolean?: boolean };
  PrescribedBy: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
  };
  Notes: string;
  PrescriptionInstructions: string;
  PatientCompliance: { ynIndicatorsimple: string; boolean?: boolean };
  TreatmentType: string;
  PrescriptionStatus: string;
  NonAuthoritativeIndicator: string;
  PrescriptionIdentifier: string;
  PriorPrescriptionReferenceIdentifier: string;
  DispenseInterval: string;
  DrugDescription: string;
  SubstitutionNotAllowed: string;
  ProblemCode: string;
  ProtocolIdentifier: string;
  duration: { Y: number; M: number; W: number; D: number };
  refill_duration: { Y: number; M: number; W: number; D: number };
  site_id: number;
};

export type MedFormType = {
  temp_id?: string;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  StartDate: number | null;
  DrugIdentificationNumber: string;
  DrugName: string;
  Strength: { Amount: string; UnitOfMeasure: string };
  NumberOfRefills: string;
  Dosage: string;
  DosageUnitOfMeasure: string;
  Form: string;
  Route: string;
  Frequency: string;
  Duration: string;
  RefillDuration: string;
  Quantity: string;
  RefillQuantity: string;
  LongTermMedication: { ynIndicatorsimple: string; boolean?: boolean };
  PrescribedBy: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
  };
  Notes: string;
  PrescriptionInstructions: string;
  SubstitutionNotAllowed: string;
  duration: { Y: number; M: number; W: number; D: number };
  refill_duration: { Y: number; M: number; W: number; D: number };
  site_id: number;
};

export type MedTemplateType = {
  id: number;
  author_id: number;
  date_created: number;
  DrugIdentificationNumber: string;
  DrugName: string;
  Strength: { Amount: string; UnitOfMeasure: string };
  Dosage: string;
  DosageUnitOfMeasure: string;
  Form: string;
  Route: string;
  Frequency: string;
  Duration: string;
  RefillDuration: string;
  NumberOfRefills: string;
  Quantity: string;
  RefillQuantity: string;
  LongTermMedication: { ynIndicatorsimple: string };
  Notes: string;
  PrescriptionInstructions: string;
  SubstitutionNotAllowed: string;
  duration: { Y: number; M: number; W: number; D: number };
  refill_duration: { Y: number; M: number; W: number; D: number };
};

export type MedTemplateFormType = {
  author_id: number;
  date_created: number;
  DrugIdentificationNumber: string;
  DrugName: string;
  Strength: { Amount: string; UnitOfMeasure: string };
  Dosage: string;
  DosageUnitOfMeasure: string;
  Form: string;
  Route: string;
  Frequency: string;
  Duration: string;
  RefillDuration: string;
  NumberOfRefills: string;
  Quantity: string;
  RefillQuantity: string;
  LongTermMedication: { ynIndicatorsimple: string };
  Notes: string;
  PrescriptionInstructions: string;
  SubstitutionNotAllowed: string;
  duration: { Y: number; M: number; W: number; D: number };
  refill_duration: { Y: number; M: number; W: number; D: number };
};

export type MessageType = {
  id: number;
  from_id: number;
  to_staff_ids: number[];
  subject: string;
  body: string;
  attachments_ids: number[] | { attachment: MessageAttachmentType }[];
  related_patient_id: number;
  read_by_staff_ids: number[];
  deleted_by_staff_ids: number[];
  previous_messages: { message_type: string; id: number }[];
  date_created: number;
  type: string;
  high_importance: boolean;
  //add-on
  patient_infos?: DemographicsType;
};

export type MessageAttachmentType = {
  id: number | string;
  file: AttachmentType | null;
  alias: string;
  date_created: number;
  created_by_user_type: "staff" | "patient";
  created_by_id: number;
};

export type MessageExternalType = {
  id: number;
  from_staff_id: number;
  from_patient_id: number;
  to_staff_id: number;
  to_patients_ids: number[] | { to_patient_infos: DemographicsType }[];
  subject: string;
  body: string;
  attachments_ids: number[] | { attachment: MessageAttachmentType }[];
  read_by_staff_id: number;
  read_by_patients_ids: number[];
  deleted_by_staff_id: number;
  deleted_by_patients_ids: number[];
  previous_messages_ids: number[] | { previous_message: MessageExternalType }[];
  date_created: number;
  type: string;
  high_importance: boolean;
  //Add-on
  from_patient_infos?: DemographicsType;
};

export type MessageExternalTemplateType = {
  id: number;
  name: string;
  date_created: number;
  author_id: number;
  subject: string;
  body: string;
};

export type MessageTemplateType = {
  id: number;
  name: string;
  author_id: number;
  to_staff_ids: number[];
  subject: string;
  body: string;
  date_created: number;
};

export type NotepadType = {
  id: number;
  staff_id: number;
  notes: string;
  date_created: number;
};

export type OHIPFeeType = {
  id: number;
  billing_code: string;
  effective_date: number;
  termination_date: number;
  provider_fee: number;
  assistant_fee: number;
  specialist_fee: number;
  anaesthetist_fee: number;
  non_anaesthetist_fee: number;
};

export type PamphletType = {
  id: number;
  date_created: number;
  created_by_id: number;
  file: AttachmentType | null;
  notes: string;
  name: string;
};

export type PamphletFormType = {
  date_created: number;
  created_by_id: number;
  file: AttachmentType | null;
  notes: string;
  name: string;
};

export type PastHealthType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  PastHealthProblemDescriptionOrProcedures: string;
  DiagnosisProcedureCode: {
    StandardCodingSystem: string;
    StandardCode: string;
    StandardCodeDescription: string;
  };
  OnsetOrEventDate: number | null;
  LifeStage: string;
  ResolvedDate: number | null;
  ProcedureDate: number | null;
  Notes: string;
  ProblemStatus: string;
};

export type PastHealthFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  PastHealthProblemDescriptionOrProcedures: string;
  OnsetOrEventDate: number | null;
  LifeStage: string;
  ResolvedDate: number | null;
  ProcedureDate: number | null;
  Notes: string;
  ProblemStatus: string;
};

export type PatientType = {
  id: number;
  email: string;
  password: string;
  access_level: "patient";
  account_status: string;
  created_by_id: number;
  date_created: number;
  temp_login: { temp_password: string; expiration: number; used: boolean };
  pin: string;
};

export type PersonalHistoryType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
};

export type PersonalHistoryFormType = {
  occupations: string;
  income: string;
  religion: string;
  sexual_orientation: string;
  special_diet: string;
  smoking: string;
  alcohol: string;
  recreational_drugs: string;
};

export type PharmacyType = {
  id: number;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
  Name: string;
  Address: {
    Structured: {
      Line1: string;
      Line2?: string;
      Line3?: string;
      City: string;
      CountrySubDivisionCode: string;
      PostalZipCode: { PostalCode: string; ZipCode: string };
    };
    _addressType: string;
  };
  PhoneNumber: {
    extension?: string;
    phoneNumber: string;
    _phoneNumberType: string;
  }[];
  FaxNumber: {
    _phoneNumberType: string;
    phoneNumber: string;
    extension?: string;
  };
  EmailAddress: string;
};

export type PharmacyFormType = {
  name: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
  zipCode: string;
  phone: string;
  fax: string;
  email: string;
};

export type PregnancyType = {
  id: number;
  patient_id: number;
  date_of_event: number;
  description: string;
  premises: string;
  term_nbr_of_weeks: number;
  term_nbr_of_days: number;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
  notes: string;
};

export type PrescriptionType = {
  id: number;
  patient_id: number;
  attachment_id: number;
  unique_id: string;
  date_created: number;
  //Add-on
  attachment: {
    id: integer;
    alias: text;
    date_created: timestamp;
    created_by_id: integer;
    file: AttachmentType;
  };
};

export type ProblemListType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  ProblemDiagnosisDescription: string;
  DiagnosisCode: {
    StandardCodingSystem: string;
    StandardCode: string;
    StandardCodeDescription: string;
  };
  ProblemDescription: string;
  ProblemStatus: string;
  OnsetDate: number | null;
  LifeStage: string;
  ResolutionDate: number | null;
  Notes: string;
};

export type ProblemListFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  ProblemDiagnosisDescription: string;
  ProblemDescription: string;
  ProblemStatus: string;
  OnsetDate: number | null;
  LifeStage: string;
  ResolutionDate: number | null;
  Notes: string;
};

export type RelationshipType = {
  id: number;
  patient_id: number;
  relationship: string;
  relation_id: number;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
  //Add-on
  relation_infos?: DemographicsType;
};

export type ReminderType = {
  id: number;
  patient_id: number;
  reminder: string;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
};

export type ReminderFormType = {
  patient_id: number;
  reminder: string;
  created_by_id: number;
  date_created: number;
};

export type ReportType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  name: string;
  Media: string;
  Format: string;
  FileExtensionAndVersion: string;
  FilePath: string;
  Content: { TextContent: string; Media: string };
  Class: string;
  SubClass: string;
  EventDateTime: number | null;
  ReceivedDateTime: number | null;
  SourceAuthorPhysician: {
    AuthorName?: { FirstName: string; LastName: string };
    AuthorFreeText: string;
  };
  SourceFacility: string;
  ReportReviewed: {
    Name: { FirstName: string; LastName: string };
    ReviewingOHIPPhysicianId: string;
    DateTimeReportReviewed: number | null;
  }[];
  SendingFacilityId: string;
  SendingFacilityReport: string;
  OBRContent: {
    AccompanyingSubClass: string;
    AccompanyingMnemonic: string;
    AccompanyingDescription: string;
    ObservationDateTime: number;
  }[];
  HRMResultStatus: string;
  MessageUniqueID: string;
  Notes: string;
  RecipientName: { FirstName: string; LastName: string };
  DateTimeSent: number | null;
  acknowledged: boolean;
  assigned_staff_id: number;
  File: AttachmentType | null;
  //Add-on
  patient_infos?: DemographicsType;
};

export type ReportFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  name: string;
  Media: string;
  Format: string;
  FileExtensionAndVersion: string;
  FilePath: string;
  Content: { TextContent: string; Media: string };
  Class: string;
  SubClass: string;
  EventDateTime: number | null;
  ReceivedDateTime: number | null;
  SourceAuthorPhysician: {
    AuthorName?: { FirstName: string; LastName: string };
    AuthorFreeText: string;
  };
  ReportReviewed: {
    Name: { FirstName: string; LastName: string };
    ReviewingOHIPPhysicianId: string;
    DateTimeReportReviewed: number | null;
  }[];
  Notes: string;
  RecipientName: { FirstName: string; LastName: string };
  DateTimeSent: number | null;
  acknowledged: boolean;
  assigned_staff_id: number;
  File: AttachmentType | null;
};

export type RiskFactorType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  RiskFactor: string;
  ExposureDetails: string;
  AgeOfOnset: string;
  StartDate: number | null;
  EndDate: number | null;
  LifeStage: string;
  Notes: string;
};

export type RiskFactorFormType = {
  patient_id: number;
  date_created: number;
  created_by_id: number;
  RiskFactor: string;
  ExposureDetails: string;
  AgeOfOnset: string;
  StartDate: number | null;
  EndDate: number | null;
  LifeStage: string;
  Notes: string;
};

export type InvitationTemplateType = {
  name: string;
  intro: string;
  infos: string;
  message: string;
};

export type SettingsType = {
  id: number;
  staff_id: number;
  slot_duration: string;
  first_day: number;
  invitation_templates: InvitationTemplateType[];
  clinical_notes_order: string;
  date_created: number;
  autolock_time_min: number;
  authorized_messages_patients_ids: number[];
};

export type SiteType = {
  id: number;
  name: string;
  address: string;
  postal_code: string;
  zip_code: string;
  province_state: string;
  city: string;
  phone: string;
  fax: string;
  logo: AttachmentType | null;
  rooms: RoomType[];
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
  email: string;
  site_status: "Open" | "Closed";
};

export type SiteFormType = {
  name: string;
  address: string;
  postal_code: string;
  zip_code: string;
  province_state: string;
  city: string;
  phone: string;
  fax: string;
  logo: AttachmentType | null;
  rooms: RoomType[];
  created_by_id: number;
  date_created: number;
  email: string;
  site_status: "Open";
};

export type RoomType = { id: string; title: string };

export type StaffType = {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  title: string;
  speciality: string;
  subspeciality: string;
  licence_nbr: string;
  access_level: "staff";
  account_status: "Active" | "Closed" | "Suspended";
  cell_phone: string;
  backup_phone: string;
  video_link: string;
  sign: AttachmentType | null;
  temp_login: { temp_password: string; expiration: number; used: boolean };
  ai_consent: boolean;
  ohip_billing_nbr: string;
  date_created: number;
  updates: {
    date_updated: number;
    updated_by_id: number;
    updated_by_user_type: string;
  }[];
  created_by_id: number;
  site_id: number;
  patients: number[];
  //add-ons
  site_infos?: SiteType;
  staff_settings?: {
    authorized_messages_patients_ids: number[];
  };
};

export type StaffFormType = {
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  title: string;
  speciality: string;
  subspeciality: string;
  licence_nbr: string;
  access_level: "staff";
  account_status: "Active" | "Closed" | "Suspended";
  cell_phone: string;
  backup_phone: string;
  video_link: string;
  sign: AttachmentType | null;
  ai_consent: boolean;
  ohip_billing_nbr: string;
  date_created: number;
  created_by_id: number;
  site_id: number;
};

export type SearchStaffType = {
  email: string;
  name: string;
  title: string;
  speciality: string;
  subspeciality: string;
  phone: string;
  licence_nbr: string;
  ohip_billing_nbr: string;
  site_id: number;
};

export type TodoType = {
  id: number;
  subject: string;
  body: string;
  to_staff_id: number;
  related_patient_id: number;
  attachments_ids: number[] | { attachment: MessageAttachmentType }[];
  date_created: number;
  done: boolean;
  due_date: number | null;
  high_importance: boolean;
  read: boolean;
  from_staff_id: number;
  //add-ons
  patient_infos?: DemographicsType;
};

export type TodoTemplateType = {
  id: number;
  name: string;
  subject: string;
  body: string;
  author_id: number;
  date_created: number;
};
//WEATHER API Types
export type WeatherType = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
};

//SRFAX API Types
export type FaxInboxType = {
  FileName: string;
  ReceiveStatus: string;
  Date: string;
  EpochTime: string;
  CallerID: string;
  RemoteID: string;
  Pages: number;
  Size: number;
  ViewedStatus: string;
};

export type FaxOutboxType = {
  FileName: string;
  SentStatus: string;
  DateQueued: string;
  DateSent: string;
  EpochTime: string;
  ToFaxNumber: string;
  Pages: number;
  Duration: number;
  RemoteID: string;
  ErrorCode: string;
  AccountCode: string;
  SenderEmail: string;
  Subject: string;
  Size: number;
  SubmittedFiles: string;
};

export type FaxToPostType = {
  sToFaxNumber: string;
  sCPFromName: string;
  sCPToName: string;
  sCPOrganization: string;
  sCPSubject: string;
  sCPComments: string;
  sFileName_1?: string;
  fileURL?: string;
};

export type FaxToDeleteType = {
  faxFileName: string;
  direction: "IN" | "OUT";
};
export type FaxesToDeleteType = {
  faxFileNames: string[];
  direction: "IN" | "OUT";
};

export type XanoPaginatedType<T> = {
  curPage: number;
  itemsReceived: number;
  itemsTotal: number;
  nextPage: number | null;
  offset: number;
  pageTotal: number;
  prevPage: number | null;
  items: T[];
};

//We don't put DEMOGRAPHICS, DOCTORS, AGE CALCULATOR, REPORTS, LABELS because they are apart from the rest
export type TopicPaginatedDataMap = {
  ["PAST HEALTH"]: XanoPaginatedType<PastHealthType>;
  ["FAMILY HISTORY"]: XanoPaginatedType<FamilyHistoryType>;
  ["RELATIONSHIPS"]: XanoPaginatedType<RelationshipType>;
  ["ALERTS & SPECIAL NEEDS"]: XanoPaginatedType<AlertType>;
  ["RISK FACTORS"]: XanoPaginatedType<RiskFactorType>;
  ["MEDICATIONS & TREATMENTS"]: XanoPaginatedType<MedType>;
  ["PAST PRESCRIPTIONS"]: XanoPaginatedType<PrescriptionType>;
  ["PHARMACIES"]: XanoPaginatedType<PharmacyType>;
  ["E-FORMS"]: XanoPaginatedType<EformType>;
  ["REMINDERS"]: XanoPaginatedType<ReminderType>;
  ["LETTERS/REFERRALS"]: XanoPaginatedType<LetterType>;
  ["GROUPS"]: XanoPaginatedType<GroupType>;
  ["PERSONAL HISTORY"]: XanoPaginatedType<PersonalHistoryType>;
  ["CARE ELEMENTS"]: XanoPaginatedType<CareElementType>;
  ["PROBLEM LIST"]: XanoPaginatedType<ProblemListType>;
  ["PREGNANCIES"]: XanoPaginatedType<PregnancyType>;
  ["CYCLES"]: XanoPaginatedType<CycleType>;
  ["ALLERGIES & ADVERSE REACTIONS"]: XanoPaginatedType<AllergyType>;
  ["IMMUNIZATIONS"]: XanoPaginatedType<ImmunizationType>;
  ["APPOINTMENTS"]: XanoPaginatedType<AppointmentType>;
  ["MESSAGES ABOUT PATIENT"]: XanoPaginatedType<MessageType>;
  ["MESSAGES WITH PATIENT"]: XanoPaginatedType<MessageExternalType>;
  ["TO-DOS ABOUT PATIENT"]: XanoPaginatedType<TodoType>;
};

export type TopicDataMap = {
  ["PAST HEALTH"]: PastHealthType;
  ["FAMILY HISTORY"]: FamilyHistoryType;
  ["RELATIONSHIPS"]: RelationshipType;
  ["ALERTS & SPECIAL NEEDS"]: AlertType;
  ["RISK FACTORS"]: RiskFactorType;
  ["MEDICATIONS & TREATMENTS"]: MedType;
  ["PAST PRESCRIPTIONS"]: PrescriptionType;
  ["PHARMACIES"]: PharmacyType;
  ["E-FORMS"]: EformType;
  ["REMINDERS"]: ReminderType;
  ["LETTERS/REFERRALS"]: LetterType;
  ["GROUPS"]: GroupType;
  ["PERSONAL HISTORY"]: PersonalHistoryType;
  ["CARE ELEMENTS"]: CareElementType;
  ["PROBLEM LIST"]: ProblemListType;
  ["PREGNANCIES"]: PregnancyType;
  ["CYCLES"]: CycleType;
  ["ALLERGIES & ADVERSE REACTIONS"]: AllergyType;
  ["IMMUNIZATIONS"]: ImmunizationType;
  ["APPOINTMENTS"]: AppointmentType;
  ["MESSAGES ABOUT PATIENT"]: MessageType;
  ["MESSAGES WITH PATIENT"]: MessageExternalType;
  ["TO-DOS ABOUT PATIENT"]: TodoType;
};

export type TopicType = keyof TopicDataMap;
export type TopicPaginatedType = keyof TopicPaginatedDataMap;
export type UpdateType = {
  date_updated: number;
  updated_by_id: number;
  updated_by_user_type?: string;
};

export type TopicExportType =
  | "DEMOGRAPHICS"
  | "CLINICAL NOTES"
  | "PAST HEALTH"
  | "FAMILY HISTORY"
  | "ALERTS & SPECIAL NEEDS"
  | "RISK FACTORS"
  | "MEDICATIONS & TREATMENTS"
  | "FAMILY DOCTORS & SPECIALISTS"
  | "PHARMACIES"
  | "PERSONAL HISTORY"
  | "CARE ELEMENTS"
  | "PROBLEM LIST"
  | "PREGNANCIES"
  | "CYCLES"
  | "ALLERGIES & ADVERSE REACTIONS"
  | "IMMUNIZATIONS"
  | "PAST PRESCRIPTIONS"
  | "REPORTS"
  | "E-FORMS"
  | "LETTERS/REFERRALS";

export type CareElementHistoryTopicType =
  | "SMOKING STATUS"
  | "SMOKING PACKS PER DAY"
  | "WEIGHT"
  | "WEIGHT LBS"
  | "HEIGHT"
  | "HEIGHT FEET"
  | "WAIST CIRCUMFERENCE"
  | "BLOOD PRESSURE"
  | "BODY MASS INDEX"
  | "BODY SURFACE AREA";

export type XMLExportFunctionType =
  | ((jsObj: AlertType) => string)
  | ((jsObj: AllergyType) => string)
  | ((jsObj: AppointmentType) => string)
  | ((jsObj: CareElementType) => string)
  | ((jsObj: ClinicalNoteType) => string)
  | ((jsObj: DemographicsType) => string)
  | ((jsObj: FamilyHistoryType) => string)
  | ((jsObj: ImmunizationType) => string)
  | ((jsObj: MedType) => string)
  | ((jsObj: PastHealthType) => string)
  | ((jsObj: PersonalHistoryType) => string)
  | ((jsObj: PregnancyType) => string)
  | ((jsObj: ProblemListType) => string)
  | ((jsObj: RelationshipType, patientInfos: DemographicsType) => string)
  | ((jsObj: ReportType) => string)
  | ((jsObj: RiskFactor) => string);
