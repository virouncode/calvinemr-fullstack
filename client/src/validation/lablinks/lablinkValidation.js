import * as yup from "yup";

export const lablinkSchema = yup.object({
  name: yup.string().required("Name field is required"),
  url: yup.string().required("URL field is required"),
});
