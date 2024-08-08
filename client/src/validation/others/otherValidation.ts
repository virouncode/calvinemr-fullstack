import * as yup from "yup";

export const otherSchema = yup.object({
  name: yup.string().required("Name field is required"),
  fax: yup
    .string()
    .required("Fax field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Fax number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
});
