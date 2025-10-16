import { z } from "zod";

export const authSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 characters long")
    .max(4, "PIN must be at most 4 characters long")
    .regex(/^[0-9]+$/, "PIN must contain only numbers"),
});

export type AuthType = z.infer<typeof authSchema>;

export const authQuerySchema = z.object({
  userType: z.enum(["admin", "staff", "patient", "reset"]),
});
