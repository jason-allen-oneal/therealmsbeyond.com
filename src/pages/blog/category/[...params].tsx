import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  getBlogCategoryById,
  getBlogArticlesByCategory,
} from "@/lib/services/blog";
import { paginate } from "@/lib/utils";
import Layout from "@/components/Layout";
import Pagination from "@/components/elements/Pagination";
import BlogCategoryItem from "@/components/blog/CategoryItem";

type PageProps = {
  category: BlogCategory;
  articles: Article[];
};

const BlogCategoryPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { data: session, status } = useSession();

  const category = props.category;
  const articles = props.articles;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedArticles = paginate(articles, currentPage, pageSize);

  const pageData = {
    title: category?.name + " Articles",
    description: "Blog articles from " + category?.name,
  };

  return (
    <>
      <Layout data={pageData}>
        <div className="border border-primary">
          <div className="mt-8 mb-6 flex justify-center px-4">
            <h2 className="flex-auto text-2xl font-bold">
              Blog Category - {category?.name}
            </h2>
            {status !== "authenticated" ? (
              <p>
                You must{" "}
                <Link href="/user/login/">
                  <a>login</a>
                </Link>{" "}
                or{" "}
                <Link href="/user/register/">
                  <a>register an account</a>
                </Link>{" "}
                to post an article!
              </p>
            ) : (
              <Link href={"/blog/article/add/" + category?.id + "/"}>
                <a className="btn btn-secondary">Add Article</a>
              </Link>
            )}
          </div>

          <div className="mt-8 mb-6 p-4">
            <div className="grid grid-cols-2">
              {paginatedArticles.length > 0 &&
                articles.map((article: any) => (
                  <BlogCategoryItem
                    key={article.id}
                    article={article}
                    inCategory={true}
                  />
                ))}
            </div>
          </div>

          <div className="mt-8 mb-6 flex justify-center">
            <Pagination
              items={articles.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const id = +context.params.params[0];

  const category = await getBlogCategoryById(id);

  const result = await getBlogArticlesByCategory(
    category?.id as number,
    "desc"
  );
  const articles = JSON.parse(JSON.stringify(result.articles));

  return {
    props: {
      category,
      articles,
    },
  };
}

export default BlogCategoryPage;
