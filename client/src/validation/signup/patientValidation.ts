import * as yup from "yup";

export const patientSchema = yup.object({
  email: yup.string().email("Invalid Email"),
  firstName: yup
    .string()
    .required("First Name field is required")
    .matches(/^[^0-9]*$/, {
      message: "Invalid First Name",
      excludeEmptyString: true,
    }),
  middleName: yup.string().matches(/^[^0-9]*$/, {
    message: "Invalid Middle Name",
    excludeEmptyString: true,
  }),
  lastName: yup
    .string()
    .required("Last Name field is required")
    .matches(/^[^0-9]*$/, {
      message: "Invalid Last Name",
      excludeEmptyString: true,
    }),
  dob: yup.string().required("Date of birth field is required"),
  sin: yup.string().matches(/^\d{3} \d{3} \d{3}$/, {
    message: "Invalid SIN: XXX XXX XXX format required",
    excludeEmptyString: true,
  }),
  assignedMd: yup
    .number()
    .required("Assigned clinic practitioner field is required")
    .notOneOf([0], "Assigned clinic practitioner field is required"),
  gender: yup.string().required("Gender field is required"),
  cellphone: yup
    .string()
    .required("Cellphone field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Cell Phone number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
  homephone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Home Phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  workphone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Work Phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  line1: yup.string().required("Address field is required"),
  province: yup.string().required("Province/State field is required"),
  postalCode: yup.string().matches(/^[A-Z]\d[A-Z] \d[A-Z]\d$/, {
    message: "Invalid Postal Code: A1A 1A1 format required",
    excludeEmptyString: true,
  }),
  zipCode: yup.string().matches(/^\d{5}(-\d{4})?$/, {
    message: "Invalid Zip Code: 12345 or 12345-6789 format required",
    excludeEmptyString: true,
  }),
  city: yup.string().required("City field is required"),
});
