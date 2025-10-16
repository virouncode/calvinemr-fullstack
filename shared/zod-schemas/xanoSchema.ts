import { z } from "zod";

export const xanoQuerySchema = z.looseObject({
  userType: z.enum(["admin", "staff", "patient", "reset"]),
});
export type XanoQueryType = z.infer<typeof xanoQuerySchema>;
