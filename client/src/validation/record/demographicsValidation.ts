import * as yup from "yup";

export const demographicsSchema = yup.object({
  firstName: yup
    .string()
    .required("First name field is required")
    .matches(/^[^0-9]*$/, {
      message: "Invalid First name",
      excludeEmptyString: true,
    }),
  middleName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid Middle name",
    excludeEmptyString: true,
  }),
  lastName: yup
    .string()
    .required("Last name field is required")
    .matches(/^[^0-9]*$/, {
      message: "Invalid Last name",
      excludeEmptyString: true,
    }),
  nickName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid Nickname",
    excludeEmptyString: true,
  }),
  dob: yup.string().required("Date of birth field is required"),
  healthNbr: yup.string().max(20, "Invalid Health Card#"),
  healthVersion: yup.string().max(2, "Invalid Health Card Version"),
  healthExpiry: yup.string(),
  gender: yup.string().required("Gender field is required"),
  sin: yup.string().matches(/^\d{3} \d{3} \d{3}$/, {
    message: "Invalid SIN: XXX XXX XXX format required",
    excludeEmptyString: true,
  }),
  email: yup
    .string()
    .required("Email field is required")
    .email("Invalid Email"),
  cellphone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Cell phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  homephone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Home phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  workphone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Work phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  line1: yup.string().required("Address field is required"),
  city: yup.string().required("City field is required"),
  postalCode: yup.string().matches(/^[A-Z]\d[A-Z] \d[A-Z]\d$/, {
    message: "Invalid Postal Code: A1A 1A1 format required",
    excludeEmptyString: true,
  }),
  zipCode: yup.string().matches(/^\d{5}(-\d{4})?$/, {
    message: "Invalid Zip Code: 12345 or 12345-6789 format required",
    excludeEmptyString: true,
  }),
  province: yup.string().required("Province/State field is required"),
  preferredOff: yup
    .string()
    .required("Preferred official language field is required"),
  status: yup.string().required("Person status field is required"),
  assignedMd: yup
    .string()
    .required("Assigned clinic practicioner field is required"),
  pPhysicianFirstName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid primary physician first name",
    excludeEmptyString: true,
  }),
  pPhysicianLastName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid primary physician last name",
    excludeEmptyString: true,
  }),
  pPhysicianOHIP: yup.string(),
  pPhysicianCPSO: yup.string(),
  rPhysicianFirstName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid referred physician first name",
    excludeEmptyString: true,
  }),
  rPhysicianLastName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid referred physician last name",
    excludeEmptyString: true,
  }),
  fPhysicianFirstName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid family physician first name",
    excludeEmptyString: true,
  }),
  fPhysicianLastName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid family physician last name",
    excludeEmptyString: true,
  }),
  emergencyFirstName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid Emergency contact first name",
    excludeEmptyString: true,
  }),
  emergencyMiddleName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid Emergency contact middle name",
    excludeEmptyString: true,
  }),
  emergencyLastName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid Emergency contact last name",
    excludeEmptyString: true,
  }),
  emergencyEmail: yup.string().email("Invalid Emergency contact email"),
  emergencyPhone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message:
      "Invalid Emergency contact phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
});
