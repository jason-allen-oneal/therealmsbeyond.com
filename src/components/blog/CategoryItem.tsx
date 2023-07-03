import { truncate, getTime } from "@/lib/utils";
import {
  ArticleTitle,
  ArticleAuthor,
  ArticleCategory,
  ArticleLink,
} from "./Article";

type Props = {
  article: Article;
  inCategory?: boolean;
};

const BlogCategoryItem = ({ article, inCategory }: Props) => {
  let inCat = false;
  if (inCategory != undefined) {
    inCat = inCategory;
  }

  return (
    <div className="rounded border-2 border-primary bg-base-200 p-4 overflow-hidden shadow-xl mt-2">
      <div className="flex justify-center">
        <ArticleTitle title={article.title} />
        {!inCat && <ArticleCategory category={article.BlogCategory} />}
      </div>
      <div className="flex justify-between">
        <div className="text-sm font-semibold">
          {getTime("short", article.date)}
        </div>
        <div className="text-sm font-semibold">
          <ArticleAuthor user={article.User} />
        </div>
      </div>

      <div
        className="mb-3"
        dangerouslySetInnerHTML={{ __html: truncate(article.text) }}
      />

      <ArticleLink article={article} />
    </div>
  );
};

export default BlogCategoryItem;
