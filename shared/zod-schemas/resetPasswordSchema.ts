import z from "zod";

export const resetPasswordQuerySchema = z.object({
  URL: z.url("Invalid URL").nonempty("URL is required"),
  userType: z.enum(["admin", "staff", "patient", "reset"]),
  tempToken: z.string().nonempty("Temporary token is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirm_password: z.string().nonempty("Confirm Password is required"),
    pin: z
      .string()
      .min(4, "PIN must be exactly 4 digits")
      .max(4, "PIN must be exactly 4 digits")
      .regex(/^\d{4}$/, "PIN must contain only numbers"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // Set the path of the error to the confirm_password field
  });
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const resetStaffPwdFromAdminSchema = z.object({
  staff_id: z.number().min(1, "Staff ID must be a positive number"),
  email: z.email("Invalid email address"),
  clinic_name: z
    .string()
    .min(2, "Clinic name must be at least 2 characters long"),
  full_name: z.string().min(2, "Full name must be at least 2 characters long"),
});

export const resetPatientPwdFromAdminSchema = z.object({
  patient_id: z.number().min(1, "Patient ID must be a positive number"),
  email: z.email("Invalid email address"),
  clinic_name: z
    .string()
    .min(2, "Clinic name must be at least 2 characters long"),
  full_name: z.string().min(2, "Full name must be at least 2 characters long"),
});
