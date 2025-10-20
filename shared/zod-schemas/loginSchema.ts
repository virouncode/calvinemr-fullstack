import z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password field is required"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
