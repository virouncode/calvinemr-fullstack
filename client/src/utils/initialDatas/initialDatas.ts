import { AvailabilityType, CycleType, SiteType } from "../../types/api";

export const initialAvailability: AvailabilityType = {
  id: 0,
  staff_id: 0,
  schedule_morning: {
    monday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
    tuesday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
    wednesday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
    thursday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
    friday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
    saturday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
    sunday: [
      { hours: "", min: "", ampm: "AM" },
      { hours: "", min: "", ampm: "AM" },
    ],
  },
  schedule_afternoon: {
    monday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
    tuesday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
    wednesday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
    thursday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
    friday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
    saturday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
    sunday: [
      { hours: "", min: "", ampm: "PM" },
      { hours: "", min: "", ampm: "PM" },
    ],
  },
  unavailability: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
  default_duration_hours: 1,
  default_duration_min: 0,
  date_created: 0,
};

export const initialSite: SiteType = {
  id: 0,
  name: "",
  address: "",
  postal_code: "",
  zip_code: "",
  province_state: "",
  city: "",
  phone: "",
  fax: "",
  logo: null,
  rooms: [],
  created_by_id: 0,
  date_created: 0,
  updates: [],
  email: "",
  site_status: "Open",
};

export const initialCycle = (patientId: number): Partial<CycleType> => ({
  cycle_length: "",
  menstruation_length: "",
  etiology: "",
  amh: "",
  partner_sperm: true,
  donor_sperm_nbr: "",
  lmp: null,
  ohip_funded: false,
  cancelled: false,
  cycle_type: "",
  third_party: "",
  prewash_concentration: "",
  prewash_motility: "",
  postwash_motility: "",
  postwash_total_motile_sperm: "",
  test_blood_type_female: "",
  test_blood_type_male: "",
  test_hiv_female: "",
  test_hiv_male: "",
  test_hep_b_female: "",
  test_hep_b_male: "",
  test_hep_c_female: "",
  test_hep_c_male: "",
  test_syphilis_female: "",
  test_syphilis_male: "",
  test_cmv_female: "",
  test_cmv_male: "",
  test_sonohysterogram_female: "",
  test_endo_bx_female: "",
  patient_id: patientId,
  cycle_nbr: "",
  events: [],
  notes: [],
  cycle_notes: "",
  status: "Active",
});
