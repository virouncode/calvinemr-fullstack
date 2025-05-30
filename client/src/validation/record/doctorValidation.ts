import * as yup from "yup";

export const doctorSchema = yup.object({
  firstName: yup.string().required("First name field is required"),
  lastName: yup.string().required("Last name field is required"),
  line1: yup.string().required("Address field is required"),
  city: yup.string().required("City field is required"),
  postalCode: yup.string().matches(/^[A-Z]\d[A-Z] \d[A-Z]\d$/, {
    message: "Invalid Postal Code: A1A 1A1 format required",
  }),
  zipCode: yup.string().matches(/^\d{5}(-\d{4})?$/, {
    message: "Invalid Zip Code: 12345 or 12345-6789 format required",
    excludeEmptyString: true,
  }),
  province: yup.string().required("Province/state field is required"),
  phone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Phone number: XXX-XXX-XXXX format required",
  }),
  fax: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Fax number: XXX-XXX-XXXX format required",
  }),
  email: yup.string().email("Invalid Email"),
  ohip_billing_nbr: yup.string().matches(/^\d{6}$/, {
    message: "Invalid OHIP billing number: 6-digits format required",
  }),
});
