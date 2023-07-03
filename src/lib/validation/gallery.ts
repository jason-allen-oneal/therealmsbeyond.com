import { object, string, number, InferType } from "yup";

let gallerySchema = object({
  title: string().min(4).max(80).required(),
  description: string().max(250),
  category: number().positive(),
});

export default gallerySchema;
export type GalleryInput = InferType<typeof gallerySchema>;
