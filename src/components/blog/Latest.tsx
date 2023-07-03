import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { truncate, getTime } from "@/lib/utils";

const BlogLatest = () => {
  const [data, setData] = useState<Article>();

  useEffect(() => {
    fetch("/api/blog/latest")
      .then((res) => res.json())
      .then((data) => {
        setData(data?.result);
      });
  }, []);

  const article = data;

  if (article == undefined) return <></>;

  return (
    <>
      <h2 className="mb-3 text-3xl font-bold">From Our Blog...</h2>
      <div className="w-full">
        <div className="rounded border-2 border-primary bg-base-200 p-4 overflow-hidden shadow-xl flex flex-col justify-between leading-normal">
          <div className="mb-8">
            {article.featured && (
              <p className="text-sm text-base-content flex items-center">
                <svg
                  className="fill-current text-gray-500 w-3 h-3 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                </svg>
                Members only
              </p>
            )}

            <div className="font-bold text-xl mb-2">
              <Link
                className="text-base-content"
                href={`/blog/article/${article.id}/${article.slug}/`}
              >
                {article.title}
              </Link>
            </div>

            <p>
              In:{" "}
              <Link
                className="text-base-content"
                href={`/blog/category/${article.BlogCategory.id}/${article.BlogCategory.slug}/`}
              >
                {article.BlogCategory.name}
              </Link>
            </p>
            <div className="text-sm">
              <p className="text-base-content">
                {getTime("short", article.date)}
              </p>
              <div>
                <div className="w-20 ml-6">
                  <Image
                    src={"/images/avatars/" + article.User.avatar}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <p>
                  <Link
                    className="font-semibold text-sm text-base-content"
                    href={`/user/${article.User.id}/${article.User.slug}/`}
                  >
                    {article.User.name}
                  </Link>
                </p>
              </div>
            </div>
            <div
              className="text-base-content leading-none p-0 m-0"
              dangerouslySetInnerHTML={{ __html: truncate(article.text) }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogLatest;
