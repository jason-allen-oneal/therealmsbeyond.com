import Comment from "./Comment";

type IComment = BlogComment | GalleryComment;
type IComments = IComment[];
type Props = {
  type: string;
  comments: IComments;
};

const Comments = (props: Props) => {
  if (props.comments.length == 0) {
    return <p>No comments yet!</p>;
  } else {
    return (
      <>
        {props.comments.map((comment: IComment, index: number) => (
          <Comment key={index} type={props.type} comment={comment} />
        ))}
      </>
    );
  }
};

export default Comments;
