import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import commentSchema, { CommentInput } from "@/lib/validation/comment";
import { useNotification } from "@/lib/contexts/notification";

type Thing = Article | Gallery;
type IComment = BlogComment | GalleryComment;

type Props = {
  type: string;
  thing: Thing;
  addComment: (comment: IComment) => void;
};

const CommentForm = ({ type, thing, addComment }: Props) => {
  const { successNotify, errorNotify } = useNotification();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CommentInput>({
    defaultValues: {
      id: thing.id,
      comment: "",
    },
    resolver: yupResolver(commentSchema),
  });

  const onSubmit = useCallback(
    async (data: CommentInput) => {
      try {
        const request = await fetch("/api/" + type + "/add/comment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await request.json();

        if (result.status === 201) {
          successNotify(result.message);
          addComment(result.result);
        } else {
          errorNotify("Something went wrong: " + result.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [addComment, errorNotify, successNotify, type]
  );

  return (
    <div className="mx-auto max-w-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-neutral text-neutral-content shadow-lg rounded-lg border-2 border-primary max-w-lg"
      >
        <div className="mb-2">
          <label htmlFor="comment" className="text-lg text-base-content">
            Add a comment
          </label>
          <br />
          <textarea
            className="w-full h-20 textarea textarea-bordered border-primary max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
            {...register("comment")}
            placeholder=""
          ></textarea>
          {errors.comment && (
            <p className="text-error">{errors.comment.message}</p>
          )}
        </div>
        <div>
          <button className="px-3 py-2 text-sm btn btn-secondary rounded">
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
