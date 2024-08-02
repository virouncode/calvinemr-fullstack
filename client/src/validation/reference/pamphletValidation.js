import * as yup from "yup";

export const pamphletSchema = yup.object({
  name: yup.string().required("Name field is required"),
});
