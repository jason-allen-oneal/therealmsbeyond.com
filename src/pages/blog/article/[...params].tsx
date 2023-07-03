import type { NextPage } from "next";
import { InferGetServerSidePropsType } from "next";

import DOMPurify from "isomorphic-dompurify";
import { getBlogCategoryById, getArticle } from "@/lib/services/blog";
import { getTime } from "@/lib/utils";
import { ArticleTitle, ArticleAuthor } from "@/components/blog/Article";
import Layout from "@/components/Layout";
import CommentSection from "@/components/blocks/CommentSection";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";

type PageProps = {
  category: BlogCategory;
  article: Article;
};

const BlogArticlePage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const category = props.category;
  const article = props.article;

  const pageData = {
    title: "Article - " + article.title,
    description: article.title,
  };

  let clean = DOMPurify.sanitize(article.text);

  return (
    <Layout data={pageData}>
      <div className="border border-primary x-4 pt-6 lg:pt-10 sm:px-6 lg:px-8 mx-auto">
        <div>
          <div className="flex justify-between items-center rounded-t border-t-2 border-l-2 border-r-2 border-primary p-4 bg-base-200">
            <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
              <div className="flex-shrink-0">
                <ArticleAuthor user={article.User} />
              </div>

              <div className="grow">
                <div className="grid sm:flex sm:justify-between sm:items-center gap-2">
                  <div>
                    <ul className="text-xs text-base-content">
                      <li className="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full">
                        {getTime("short", article.date)}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Breadcrumbs
                      base="blog"
                      parent={category}
                      item={article.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 md:space-y-8 bg-base-100 px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 shadow-xl rounded-b border-b-2 border-l-2 border-r-2 border-primary">
            <div className="space-y-3">
              <ArticleTitle title={article.title} />

              <div className="text-lg text-base-content">
                <div dangerouslySetInnerHTML={{ __html: clean }} />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10">
          <CommentSection
            type="blog"
            article={article}
            comments={article.BlogComment}
          />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const id = +context.params.params[0];

  const result = await getArticle(id);

  const category = await getBlogCategoryById(
    result?.article?.categoryId as number
  );

  const article = JSON.parse(JSON.stringify(result?.article));

  return {
    props: {
      category,
      article,
    },
  };
}

export default BlogArticlePage;
