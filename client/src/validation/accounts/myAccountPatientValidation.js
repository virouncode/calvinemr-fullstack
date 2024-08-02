import * as yup from "yup";

export const myAccountPatientSchema = yup.object({
  cell_phone: yup
    .string()
    .required("Cell Phone field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Cell Phone number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
  home_phone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Home Phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  preferred_phone: yup
    .string()
    .required("Preferred Phone field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Preferred Phone number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
  address: yup.string().required("Address field is required"),
  postal_code: yup.string().required("Postal Code field is required"),
  city: yup.string().required("City field is required"),
});
