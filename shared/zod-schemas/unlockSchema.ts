import z from "zod";

export const unlockSchema = z.object({
  user_id: z.number().min(1, "User ID must be a positive number"),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 characters long")
    .max(4, "PIN must be at most 4 characters long")
    .regex(/^[0-9]+$/, "PIN must contain only numbers"),
  userType: z.enum(["admin", "staff", "patient", "reset"]),
});

export type UnlockType = z.infer<typeof unlockSchema>;

export const unlockQuerySchema = z.object({
  userType: z.enum(["admin", "staff", "patient", "reset"]),
});
