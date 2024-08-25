import * as yup from "yup";

export const siteSchema = yup.object({
  name: yup.string().required("Site name field is required"),
  address: yup.string().required("Address field is required"),
  province_state: yup.string().required("Province/state field is required"),
  city: yup.string().required("City field is required"),
  phone: yup
    .string()
    .required("Phone field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Phone number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
  fax: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Fax number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  postal_code: yup.string().matches(/^[A-Z]\d[A-Z] \d[A-Z]\d$/, {
    message: "Invalid Postal Code, A1A 1A1 format required",
    excludeEmptyString: true,
  }),
  zip_code: yup.string().matches(/^[0-9]{5}(?:-[0-9]{4})?$/, {
    message: "Invalid Zip Code, 12345 or 12345-6789 format required",
    excludeEmptyString: true,
  }),
});
