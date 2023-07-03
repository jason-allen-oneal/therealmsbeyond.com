import { object, string, number, InferType } from 'yup';

let commentSchema = object({
  id: number().required(),
  comment: string().max(250).required(),
});

export default commentSchema;
export type CommentInput = InferType<typeof commentSchema>;