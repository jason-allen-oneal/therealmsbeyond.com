import { prisma } from "../prisma";

export const getAllCategories = async () => {
  const cats = await prisma.blogCategory.findMany();

  return cats;
};

export const getBlogCategoryBySlug = async (slug: string) => {
  const category = await prisma.blogCategory.findFirst({
    where: {
      slug: slug,
    },
  });

  return category;
};

export const getBlogCategoryById = async (id: number) => {
  const category = await prisma.blogCategory.findFirst({
    where: {
      id: id,
    },
  });

  return category;
};

export const getBlogArticlesByCategory = async (id: number, sort: string) => {
  const articles = await prisma.article.findMany({
    where: {
      categoryId: id,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      User: true,
      BlogCategory: true,
    },
  });

  return {
    articles: articles,
  };
};

export const getArticle = async (id: number) => {
  const article = await prisma.article.findUnique({
    where: {
      id: id,
    },
    include: {
      User: true,
      BlogComment: {
        include: {
          User: true,
        },
      },
      BlogCategory: true,
    },
  });

  return {
    article: article,
  };
};
