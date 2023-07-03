import { object, string, number, InferType } from "yup";

let articleSchema = object({
  title: string().min(4).max(64),
  body: string(),
  category: number(),
});

export default articleSchema;
export type ArticleInput = InferType<typeof articleSchema>;
