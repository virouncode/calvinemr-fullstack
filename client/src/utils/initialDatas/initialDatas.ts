import { AvailabilityType, SiteType } from "../../types/api";

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
