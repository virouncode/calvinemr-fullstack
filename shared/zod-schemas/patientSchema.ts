import z from "zod";

export const insertPatientSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  access_level: z.literal("patient"),
  account_status: z.literal("Active"),
  created_by_id: z.number(),
  date_created: z.number(),
  first_name: z.string().nonempty("First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().nonempty("Last name is required"),
  clinic_name: z.string().nonempty("Clinic name is required"),
});

export type InsertPatientType = z.infer<typeof insertPatientSchema>;
