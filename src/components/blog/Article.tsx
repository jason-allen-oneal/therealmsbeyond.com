import Image from "next/image";
import Link from "next/link";

type ArticleProps = {
  article: Article;
};

export function ArticleTitle({ title }: { title: string }) {
  return (
    <h2 className="flex-auto mb-3 text-2xl font-bold leading-8 tracking-tight">
      {title}
    </h2>
  );
}

type CategoryProps = {
  category: BlogCategory;
};

export function ArticleCategory({ category }: CategoryProps) {
  return (
    <div className="text-lg font-semibold">
      <p>
        In:{" "}
        <Link href={`/blog/category/${category.id}/${category.slug}/`}>
          <a>{category.name}</a>
        </Link>
      </p>
    </div>
  );
}

type AuthorProps = {
  user: User;
};

export function ArticleAuthor({ user }: AuthorProps) {
  return (
    <>
      <div>
        <div className="w-20 ml-6">
          <Image
            src={"/images/avatars/" + user.avatar}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <p>
          <Link href={`/user/profile/${user.id}/${user.slug}/`}>
            <a className="text-sm text-base-content font-semibold">
              {user.name}
            </a>
          </Link>
        </p>
      </div>
    </>
  );
}

export function ArticleLink({ article }: ArticleProps) {
  return (
    <div className="text-base font-medium leading-6">
      <Link href={`/blog/article/${article.id}/${article.slug}/`}>
        <a>Continue reading...</a>
      </Link>
    </div>
  );
}
