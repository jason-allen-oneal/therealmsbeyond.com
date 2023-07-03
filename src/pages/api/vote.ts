import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let data: APIResponse;
  let comment: BlogComment | GalleryComment;
  const { id, type } = req.body;

  try {
    if (type == "blog") {
      comment = await prisma?.blogComment.update({
        where: {
          id: id,
        },
        data: {
          votes: {
            increment: 1,
          },
        },
      });
    } else {
      comment = await prisma?.galleryComment.update({
        where: {
          id: id,
        },
        data: {
          votes: {
            increment: 1,
          },
        },
      });
    }

    data = {
      status: 201,
      message: "Retrieved",
      result: comment,
    };
  } catch (err) {
    console.log(err);
    data = {
      status: 201,
      message: "An error occurred: " + err,
      result: "error",
    };
  }

  res.json(data);
};

export default handler;
