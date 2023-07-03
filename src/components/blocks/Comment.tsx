import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { getTime } from "../../lib/utils";
import { useNotification } from "@/lib/contexts/notification";

type IComment = BlogComment | GalleryComment;

type Props = {
  comment: IComment;
  type: string;
};

const Comment = ({ comment, type }: Props) => {
  const [votes, setVotes] = useState<number>(comment.votes);
  const { successNotify, errorNotify } = useNotification();

  const handleVote = async (id: number, type: string) => {
    const input = {
      id: id,
      type: type,
    };

    try {
      const request = await fetch("/api/vote/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result = await request.json();

      if (result.status == 201) {
        successNotify("Vote added!");
        setVotes(result.result.votes);
      } else {
        errorNotify("Something went wrong: " + result.message);
        console.log("error", JSON.stringify(result));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex w-full justify-center relative top-1/3">
        <div className="relative grid grid-cols-1 gap-2 p-4 mb-6 border border-primary rounded-lg bg-neutral text-neutral-content shadow-lg">
          <div className="relative flex gap-4">
            <Image
              src={"/images/avatars/" + comment.User.avatar}
              alt=""
              className="relative rounded-lg -top-8 -mb-4 border border-secondary h-16 w-16"
            />

            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between">
                <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">
                  <Link
                    href={`/user/profile/${comment.User.id}/${comment.User.slug}/`}
                  >
                    <a className="text-sm font-semibold text-base-content">
                      {comment.User.name}
                    </a>
                  </Link>
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {getTime("short", comment.date)}
              </p>
              <p className="text-sm">
                Upvote?{" "}
                <FontAwesomeIcon
                  onClick={() => handleVote(comment.id, type)}
                  icon={faThumbsUp}
                />{" "}
                {votes}
              </p>
            </div>
          </div>
          <p className="-mt-4">{comment.text}</p>
        </div>
      </div>
    </>
  );
};

export default Comment;
