import * as yup from "yup";

export const relationshipSchema = yup.object({
  relationship: yup.string().required("Relation field is required"),
  relation_id: yup.number().required("With Patient field is required"),
});
