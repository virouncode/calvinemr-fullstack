import * as yup from "yup";

export const appointmentSchema = yup.object({
  purposes_ids: yup
    .array()
    .of(yup.number())
    .min(1, "At least one purpose must be selected")
    .required("Purpose field is required"),
  AppointmentPurpose: yup.string().required("Purpose field is required"),
  start: yup.number().required("From field is required"),
  end: yup.number().required("To field is required"),
  Duration: yup.number().positive("Appointment Duration can't be null"),
});
