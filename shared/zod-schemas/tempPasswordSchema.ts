import z from "zod";

export const tempPasswordQuerySchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  userType: z.enum(["admin", "staff", "patient", "reset"]),
});
