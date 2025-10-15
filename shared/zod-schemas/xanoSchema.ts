import { z } from "zod";

export const xanoQuerySchema = z.object({
  URL: z.string().nonempty("URL is required"),
  userType: z.enum(["admin", "staff", "patient", "reset"]),
  queryParams: z.record(z.string(), z.string().optional()).optional(),
});

export type XanoQueryType = z.infer<typeof xanoQuerySchema>;
