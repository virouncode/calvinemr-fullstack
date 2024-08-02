import * as yup from "yup";

export const cycleSchema = yup.object({
  cycle_nbr: yup
    .string()
    .required("Cycle Number field is required")
    .matches(/^\d{2}$/, {
      message:
        "Invalid Cycle Number: enter 2 digits, add a leading 0 if needed",
      excludeEmptyString: false,
    }),
  lmp: yup.number().required("LMP field is required"),
});
