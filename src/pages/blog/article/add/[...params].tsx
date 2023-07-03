import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Editor from "@/components/elements/Editor";
import { ArticleInput } from "@/lib/validation/blog";
import { getCategorySelectOptions } from "@/lib/utils";
import { requireAuth } from "@/lib/requireAuth";
import { getBlogCategoryById, getAllCategories } from "@/lib/services/blog";
import Layout from "@/components/Layout";
import { useNotification } from "@/lib/contexts/notification";
import { yupResolver } from "@hookform/resolvers/yup";
import articleSchema from "../../../../lib/validation/blog";

type PageProps = {
  category: BlogCategory;
  cats: BlogCategory[];
};

const BlogAddArticlePage: NextPage<PageProps> = ({ category, cats }: any) => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const { successNotify, errorNotify } = useNotification();

  const { handleSubmit, control, reset, register } = useForm<ArticleInput>({
    defaultValues: {
      title: "",
      body: "",
      category: 0,
    },
  });

  const onSubmit = useCallback(
    async (data: any) => {
      const input = {
        title: data.title,
        body: content,
        category: data.category as number,
      };

      try {
        const request = await fetch("/api/blog/add/article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const result = await request.json();

        if (result.status == 201) {
          successNotify(result.message, () => {
            reset();
            router.push(result.result);
          });
        } else {
          errorNotify("Something went wrong: " + result.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [content]
  );

  const options = getCategorySelectOptions(cats, category?.id);

  const pageData = {
    title: "Add Article",
    description: "",
  };

  return (
    <Layout data={pageData}>
      <div className="p-4 border border-primary">
        <h2 className="mb-3 text-3xl font-bold">Add New Article</h2>
        <div className="mt-8 mb-6 flex justify-center px-4">
          <div>
            <form
              className="p-4 bg-neutral text-neutral-content shadow-lg rounded-lg border-2 border-primary"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <label className="block">
                    <input
                      type="text"
                      placeholder="Title"
                      className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                      {...field}
                    />
                  </label>
                )}
              />

              <Controller
                name="body"
                control={control}
                render={({ field }) => <Editor onChange={setContent} />}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <label className="block mt-4">
                    <span>Category</span>
                    <select
                      className="select select-bordered bg-base-300 text-base-content w-full max-w-xs"
                      {...field}
                    >
                      <option>Choose...</option>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              />

              <div className="mt-4">
                <button className="btn btn-secondary btn-sm" type="submit">
                  Add!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = requireAuth(async (ctx: any) => {
  const id = +ctx.params.params[0];

  const category = await getBlogCategoryById(id);
  const cats = await getAllCategories();

  return {
    props: {
      category,
      cats,
    },
  };
});

export default BlogAddArticlePage;
