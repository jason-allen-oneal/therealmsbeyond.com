import { object, string, number, InferType } from "yup";

let settingsSchema = object({
  perPage: number(),
  pageSort: string(),
});

export default settingsSchema;
export type SettingsInput = InferType<typeof settingsSchema>;
