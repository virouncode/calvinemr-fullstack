import * as yup from "yup";

export const checklistSchema = yup.object({
  result: yup.string().required("Result field is required"),
  date: yup.number().required("Date field is required"),
});
