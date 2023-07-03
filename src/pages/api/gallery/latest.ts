import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const galleries = await prisma?.gallery.findMany({
    take: 4,
    include: {
      Entry: {
        select: {
          id: true,
          path: true,
          thumb: true,
        },
      },
      GalleryCategory: true,
      User: true,
      Tags: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const data = {
    status: 200,
    message: "Retrieved",
    result: galleries,
  };

  res.json(data);
};

export default handler;
