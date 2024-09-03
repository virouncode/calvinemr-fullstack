import * as yup from "yup";

export const pharmacySchema = yup.object({
  name: yup.string().required("Pharmacy name field is required"),
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
  phone: yup
    .string()
    .required("Pharmacy phone field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Phone number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
  fax: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Fax number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  email: yup.string().email("Invalid Pharmacy email"),
});
