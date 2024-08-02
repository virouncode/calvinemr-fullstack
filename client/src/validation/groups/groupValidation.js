import * as yup from "yup";

export const groupSchema = yup.object({
  name: yup.string().required("Name field is required"),
});
