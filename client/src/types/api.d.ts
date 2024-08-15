//XANO API Types
export type AdminType = {
  id: number;
  date_created: number;
  email: string;
  password: string;
  access_level: string;
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
  DateActive: number;
  EndDate: number;
};
export type PaginatedAlertsType = {
  pageParams: number[];
  pages: ({ items: AlertType[] } & PagesPropertiesType)[];
};

export type AllergyType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DatatType: string; Content: string }[];
  };
  OffendingAgentDescription: string;
  PropertyOfOffendingAgent: string;
  Code: { CodeType: string; CodeValue: string };
  ReactionType: string;
  StartDate: number;
  LifeStage: string;
  Severity: string;
  Reaction: string;
  RecordedDate: number;
  Notes: string;
};

export type PaginatedAllergiesType = {
  pageParams: number[];
  pages: ({ items: AllergyType[] } & PagesPropertiesType)[];
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
  site_infos: SiteType;
  host_infos: StaffType;
};

export type PaginatedAppointmentsType = {
  pageParams: number[];
  pages: ({ items: AppointmentType[] } & PagesPropertiesType)[];
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
  monday: { hours: string; min: string; ampm: string }[];
  tuesday: { hours: string; min: string; ampm: string }[];
  wednesday: { hours: string; min: string; ampm: string }[];
  thursday: { hours: string; min: string; ampm: string }[];
  friday: { hours: string; min: string; ampm: string }[];
  saturday: { hours: string; min: string; ampm: string }[];
  sunday: { hours: string; min: string; ampm: string }[];
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

export type PaginatedBillingCodesTemplatesType = {
  pageParams: number[];
  pages: ({ items: BillingCodeTemplateType[] } & PagesPropertiesType)[];
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
  created_by_user_type: string;
  billing_code_suffix: string;
  //add-ons
  site_infos: SiteType;
  patient_infos: DemographicsType;
  billing_infos: {
    billing_code: string;
    provider_fee: number;
    assistant_fee: number;
    specialist_fee: number;
    anaesthetist_fee: number;
    non_anaesthetist_fee: number;
  };
  diagnosis_name: { diagnosis: string };
  provider_ohip_billing_nbr: { ohip_billing_nbr: string };
  diagnosis_code: { code: number };
};

export type BillingFormType = {
  date: string;
  provider_ohip_billing_nbr: string;
  referrer_ohip_billing_nbr: string;
  patient_id: number;
  patient_hcn: string;
  patient_name: string;
  diagnosis_code: string | number;
  billing_codes: string;
  site_id: number;
};

export type PaginatedBillingsType = {
  pageParams: number[];
  pages: ({ items: BillingType[] } & PagesPropertiesType)[];
};

export type CalvinAITemplateType = {
  id: number;
  author_id: number;
  name: string;
  date_created: number;
  prompt: string;
};
export type PaginatedCalvinAITemplatesType = {
  items: CalvinAITemplateType[];
  nextPage: number | null;
};

export type CareElementType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  SmokingStatus: { Status: string; Date: number }[];
  SmokingPacks: { PerDay: string; Date: number }[];
  Weight: { Weight: string; WeightUnit: string; Date: number }[];
  Height: { Height: string; HeightUnit: string; Date: number }[];
  WaistCircumference: {
    WaistCircumference: string;
    WaistCircumferenceUnit: string;
    Date: number;
  }[];
  BloodPressure: {
    SystolicBP: string;
    DiastolicBP: string;
    BPUnit: string;
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
  HypoglycemicEpisodes: { NumOfReportedEpisodes: number; Date: number }[];
  SelfMonitoringBloodGlucose: { SelfMonitoring: string; Date: number }[];
  bodyMassIndex: { BMI: string; Date: number }[];
  bodySurfaceArea: { BSA: string; Date: number }[];
};
export type PaginatedCareElementsType = {
  pageParams: number[];
  pages: ({ items: CareElementType[] } & PagesPropertiesType)[];
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
  EventDateTime: number;
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
  attachments_ids: number[];
  date_updated: number;
};

export type PagesPropertiesType = {
  curPage: number;
  itemsReceived: number;
  itemsTotal: number;
  nextPage: number | null;
  offset: number;
  pageTotal: number;
  prevPage: number | null;
};

export type PaginatedClinicalNotesType = {
  pageParams: number[];
  pages: ({ items: ClinicalNoteType[] } & PagesPropertiesType)[];
};

export type ClinicalNoteAttachmentType = {
  id: number;
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
  EventDateTime: number;
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

export type PaginatedClinicalNoteTemplatesType = {
  pageParams: number[];
  pages: ({ items: ClinicalNoteTemplateType[] } & PagesPropertiesType)[];
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
  lmp: number;
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
  test_sonohysterogram_female: string;
  test_endo_bx_female: string;
  patient_id: number;
  cycle_nbr: string;
  events: {
    date: number;
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
  }[];
  notes: { text: string; date: number }[];
  cycle_notes: string;
  status: string;
};

export type PaginatedCyclesType = {
  pageParams: number[];
  pages: ({ items: CycleType[] } & PagesPropertiesType)[];
};

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

export type DemographicsType = {
  id: number;
  patient_id: number;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
  avatar: AttachmentType;
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
  DateOfBirth: number;
  HealthCard: {
    Number: string;
    Version: string;
    ExpiryDate: number;
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
    EnrolmentHistory: {
      EnrollmentStatus: string;
      EnrollmentDate: number;
      EnrollmentTerminationDate: number;
      TerminationReason: string;
      EnrolledToPhysician: {
        Name: { FirstName: string; LastName: string };
        OHIPPhysicianId: string;
      };
    }[];
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
  PersonStatusDate: number;
  SIN: string;
  ReferredPhysician: { FirstName: string; LastName: string };
  FamilyPhysician: { FirstName: string; LastName: string };
  PreferredPharmacy: number;
  ai_consent: boolean;
  ai_consent_read: boolean;
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
  age: number;
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

export type PaginatedDemographicsType = {
  pageParams: number[];
  pages: ({ items: DemographicsType[] } & PagesPropertiesType)[];
};

export type DiagnosisType = {
  id: number;
  code: number;
  diagnosis: string;
  category: string;
};

export type PaginatedDiagnosisType = {
  pageParams: number[];
  pages: ({ items: DiagnosisType[] } & PagesPropertiesType)[];
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
    Formatted: string;
    Structured: {
      Line1: string;
      Line2: string;
      Line3: string;
      City: string;
      CountrySubDivisionCode: string;
      PostalZipCode: { PostalCode: string; ZipCode: string };
    };
    addressType: string;
  };
  PhoneNumber: {
    areaCode: string;
    number: string;
    extension: string;
    exchange: string;
    phoneNumber: string;
    _phoneNumberType: string;
  }[];
  FaxNumber: {
    areaCode: string;
    number: string;
    extension: string;
    exchange: string;
    phoneNumber: string;
    _phoneNumberType: string;
  };
  EmailAddress: string;
  patients: number[];
  ohip_billing_nbr: string;
  speciality: string;
  licence_nbr: string;
};

export type PaginatedDoctorsType = {
  pageParams: number[];
  pages: ({ items: DoctorType[] } & PagesPropertiesType)[];
};

export type EdocType = {
  id: number;
  date_created: number;
  created_by_id: number;
  file: AttachmentType;
  notes: string;
  name: string;
};

export type PaginatedEdocsType = {
  pageParams: number[];
  pages: ({ items: EdocType[] } & PagesPropertiesType)[];
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

export type PaginatedEformsType = {
  pageParams: number[];
  pages: ({ items: EformType[] } & PagesPropertiesType)[];
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
  StartDate: number;
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

export type PaginatedFamilyHistoriesType = {
  pageParams: number[];
  pages: ({ items: FamilyHistoryType[] } & PagesPropertiesType)[];
};

export type FaxContactType = {
  id: number;
  name: string;
  category: string;
  fax_number: string;
  date_created: number;
  created_by_id: number;
};

export type PaginatedFaxContactsType = {
  pageParams: number[];
  pages: ({ items: FaxContactType[] } & PagesPropertiesType)[];
};

export type FaxTemplateType = {
  id: number;
  name: string;
  date_created: number;
  author_id: number;
  subject: string;
  body: string;
};

export type PaginatedFaxTemplatesType = {
  pageParams: number[];
  pages: ({ items: FaxTemplateType[] } & PagesPropertiesType)[];
};

export type GroupType = {
  id: number;
  date_created: number;
  staff_id: number;
  patients: number[];
  name: string;
  description: string;
  color: string;
  global: boolean;
};

export type PaginatedGroupsType = {
  pageParams: number[];
  pages: ({ items: GroupType[] } & PagesPropertiesType)[];
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
  Date: number;
  RefusedFlag: { ynIndicatorsimple: string };
  Instructions: string;
  Notes: string;
  age: string;
  doseNumber: number;
  recommended: boolean;
};

export type PaginatedImmunizationsType = {
  pageParams: number[];
  pages: ({ items: ImmunizationType[] } & PagesPropertiesType)[];
};

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

export type PaginatedLabLinksPersonalType = {
  pageParams: number[];
  pages: ({ items: LabLinkPersonalType[] } & PagesPropertiesType)[];
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

export type PaginatedLettersType = {
  pageParams: number[];
  pages: ({ items: LetterType[] } & PagesPropertiesType)[];
};

export type LetterTemplateType = {
  id: number;
  date_created: number;
  author_id: number;
  body: string;
  name: string;
  description: string;
  subject: string;
  site_id: number;
  recipient_infos: string;
};

export type PaginatedLetterTemplatesType = {
  pageParams: number[];
  pages: ({ items: LetterTemplateType[] } & PagesPropertiesType)[];
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

export type PaginatedLinksType = {
  pageParams: number[];
  pages: ({ items: LinkType[] } & PagesPropertiesType)[];
};

export type MedType = {
  id: number;
  patient_id: number;
  date_created: number;
  created_by_id: number;
  updates: { updated_by_id: number; date_updated: number }[];
  ResidualInfo: {
    DataElement: { Name: string; DataType: string; Content: string }[];
  };
  PrescriptionWrittenDate: number;
  StartDate: number;
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
  LongTermMedication: { ynIndicatorsimple: string; boolean: boolean };
  PastMedication: { ynIndicatorsimple: string; boolean: boolean };
  PrescribedBy: {
    Name: { FirstName: string; LastName: string };
    OHIPPhysicianId: string;
  };
  Notes: string;
  PrescriptionInstructions: string;
  PatientCompliance: { ynIndicatorsimple: string; boolean: boolean };
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

export type PaginatedMedsType = {
  pageParams: number[];
  pages: ({ items: MedType[] } & PagesPropertiesType)[];
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

export type PaginatedMedsTemplatesType = {
  pageParams: number[];
  pages: ({ items: MedTemplateType[] } & PagesPropertiesType)[];
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
  patient_infos: DemographicsType;
};

export type PaginatedMessagesType = {
  pageParams: number[];
  pages: ({ items: MessageType[] } & PagesPropertiesType)[];
};

export type MessageAttachmentType = {
  id: number | string;
  file: AttachmentType;
  alias: string;
  date_created: number;
  created_by_user_type: string;
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
  from_patient_infos: DemographicsType;
};

export type PaginatedMessagesExternalType = {
  pageParams: number[];
  pages: ({ items: MessageExternalType[] } & PagesPropertiesType)[];
};

export type MessageExternalTemplateType = {
  id: number;
  name: string;
  date_created: number;
  author_id: number;
  subject: string;
  body: string;
};

export type PaginatedMessageExternalTemplatesType = {
  pageParams: number[];
  pages: ({ items: MessageExternalTemplateType[] } & PagesPropertiesType)[];
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

export type PaginatedMessageTemplatesType = {
  pageParams: number[];
  pages: ({ items: MessageTemplateType[] } & PagesPropertiesType)[];
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
  file: AttachmentType;
  notes: string;
  name: string;
};

export type PaginatedPamphletsType = {
  pageParams: number[];
  pages: ({ items: PamphletType[] } & PagesPropertiesType)[];
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
  OnsetOrEventDate: number;
  LifeStage: string;
  ResolvedDate: number;
  ProcedureDate: number;
  Notes: string;
  ProblemStatus: string;
};

export type PaginatedPastHealthsType = {
  pageParams: number[];
  pages: ({ items: PastHealthType[] } & PagesPropertiesType)[];
};

export type PatientType = {
  id: number;
  email: string;
  password: string;
  access_level: string;
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

export type PaginatedPersonalHistoryType = {
  pageParams: number[];
  pages: ({ items: PersonalHistoryType[] } & PagesPropertiesType)[];
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
      Line2: string;
      Line3: string;
      City: string;
      CountrySubDivisionCode: string;
      PostalZipCode: { PostalCode: string; ZipCode: string };
    };
    _addressType: string;
  };
  PhoneNumber: {
    extension: string;
    phoneNumber: string;
    _phoneNumberType: string;
  }[];
  FaxNumber: {
    _phoneNumberType: string;
    phoneNumber: string;
    extension: string;
  };
  EmailAddress: string;
};

export type PaginatedPharmaciesType = {
  pageParams: number[];
  pages: ({ items: PharmacyType[] } & PagesPropertiesType)[];
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

export type PaginatedPregnanciesType = {
  pageParams: number[];
  pages: ({ items: PregnancyType[] } & PagesPropertiesType)[];
};

export type PrescriptionType = {
  id: number;
  patient_id: number;
  attachment_id: number;
  unique_id: string;
  date_created: number;
};

export type PaginatedPrescriptionType = {
  pageParams: number[];
  pages: ({ items: PrescriptionType[] } & PagesPropertiesType)[];
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
  OnsetDate: number;
  LifeStage: string;
  ResolutionDate: number;
  Notes: string;
};

export type PaginatedProblemListsType = {
  pageParams: number[];
  pages: ({ items: ProblemListType[] } & PagesPropertiesType)[];
};

export type RelationshipType = {
  id: number;
  patient_id: number;
  relationship: string;
  relation_id: number;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
};

export type PaginatedRelationshipsType = {
  pageParams: number[];
  pages: ({ items: RelationshipType[] } & PagesPropertiesType)[];
};

export type ReminderType = {
  id: number;
  patient_id: number;
  reminder: string;
  created_by_id: number;
  date_created: number;
  updates: { updated_by_id: number; date_updated: number }[];
};

export type PaginatedRemindersType = {
  pageParams: number[];
  pages: ({ items: ReminderType[] } & PagesPropertiesType)[];
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
  EventDateTime: number;
  ReceivedDateTime: number;
  SourceAuthorPhysician: {
    AuthorName: { FirstName: string; LastName: string };
    AuthorFreeText: string;
  };
  SourceFacility: string;
  ReportReviewed: {
    Name: { FirstName: string; LastName: string };
    ReviewingOHIPPhysicianId: string;
    DateTimeReportReviewed: number;
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
  DateTimeSent: number;
  acknowledged: boolean;
  assigned_staff_id: number;
  File: AttachmentType | null;
};

export type PaginatedReportsType = {
  pageParams: number[];
  pages: ({ items: ReportType[] } & PagesPropertiesType)[];
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
  StartDate: number;
  EndDate: string;
  LifeStage: string;
  Notes: string;
};

export type PaginatedRiskFactorsType = {
  pageParams: number[];
  pages: ({ items: RiskFactorType[] } & PagesPropertiesType)[];
};

export type SettingsType = {
  id: number;
  staff_id: number;
  slot_duration: string;
  first_day: string;
  invitation_templates: {
    name: string;
    intro: string;
    infos: string;
    message: string;
  }[];
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
  site_status: string;
};

export type RoomType = { id: string; title: string };

export type StaffType = {
  id: number;
  email: string;
  password: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  title: string;
  speciality: string;
  subspeciality: string;
  licence_nbr: string;
  access_level: string;
  account_status: string;
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
  pin: string;
  //add-ons
  site_infos: SiteType;
  staff_settings: {
    authorized_messages_patients_ids: number[];
  };
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
  attachments_ids: number[];
  date_created: number;
  done: boolean;
  due_date: number;
  high_importance: boolean;
  read: boolean;
  from_staff_id: number;
};

export type PaginatedTodosType = {
  pageParams: number[];
  pages: ({ items: TodoType[] } & PagesPropertiesType)[];
};

export type TodoTemplateType = {
  id: number;
  name: string;
  subject: string;
  body: string;
  author_id: number;
  date_created: number;
};

export type PaginatedTodoTemplatesType = {
  pageParams: number[];
  pages: ({ items: TodoTemplateType[] } & PagesPropertiesType)[];
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
  sFileName_1: string;
  fileURL: string;
};

export type FaxToDeleteType = {
  faxFileName: string;
  direction: "IN" | "OUT";
};
export type FaxesToDeleteType = {
  faxFileNames: string[];
  direction: "IN" | "OUT";
};
