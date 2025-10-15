import z from "zod";

export const attachmentSchema = z.object({
  access: z.string().nonempty("Access is required"),
  path: z.string().nonempty("Path is required"),
  name: z.string().nonempty("Name is required"),
  type: z.string().nonempty("Type is required"),
  size: z.number().min(1, "Size must be a positive number"),
  mime: z.string().nonempty("MIME type is required"),
  meta: z.object({
    width: z.number().min(1, "Width must be positive"),
    height: z.number().min(1, "Height must be positive"),
  }),
  url: z.url("Invalid URL for attachment"),
});
export type AttachmentType = z.infer<typeof attachmentSchema>;
