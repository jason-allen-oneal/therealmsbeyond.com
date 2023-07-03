import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const blog = await prisma?.blogCategory.findMany();
  console.log("blog", blog);
  const gallery = await prisma?.galleryCategory.findMany();
  console.log("gallery", gallery);
  const data = {
    status: 200,
    message: "Retrieved",
    result: {
      blog: blog,
      gallery: gallery,
    },
  };

  res.json(data);
};

export default handler;
