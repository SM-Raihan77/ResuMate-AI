import  z  from "zod";

export const optionalString = z.string().trim().optional();

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});
export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;