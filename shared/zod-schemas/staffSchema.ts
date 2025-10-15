import z from "zod";
import { attachmentSchema } from "./attachmentSchema";

export const insertStaffSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  first_name: z.string().nonempty("First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().nonempty("Last name is required"),
  full_name: z.string().nonempty("Full name is required"),
  gender: z.string().nonempty("Gender is required"),
  title: z.string().nonempty("Title is required"),
  speciality: z.string().optional(),
  subspeciality: z.string().optional(),
  licence_nbr: z.string().optional(),
  access_level: z.literal("staff"),
  account_status: z.enum(["Active", "Closed", "Suspended"]),
  cell_phone: z
    .string()
    .regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Invalid Cell Phone number: XXX-XXX-XXXX format required"
    ),
  backup_phone: z
    .string()
    .regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Invalid Backup Phone number: XXX-XXX-XXXX format required"
    )
    .optional(),
  video_link: z.url().optional(),
  sign: attachmentSchema.nullable().optional(),
  ai_consent: z.boolean(),
  ohip_billing_nbr: z.string(),
  date_created: z.number(),
  created_by_id: z.number(),
  site_id: z.number(),
  clinic_name: z.string().nonempty("Clinic name is required"),
});

export type InsertStaffType = z.infer<typeof insertStaffSchema>;
