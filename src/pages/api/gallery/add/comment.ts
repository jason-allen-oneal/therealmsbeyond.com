import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let data: APIResponse;
  const session = await getServerSession(req, res, nextAuthOptions);

  const { comment, id } = req.body;

  const cmmnt = {
    authorId: session?.user?.id as number,
    text: comment,
    galleryId: typeof id == "string" ? parseInt(id) : id,
  };

  try {
    const result = await prisma.galleryComment.create({
      data: cmmnt,
    });

    const comment = await prisma.galleryComment.findFirst({
      where: {
        id: result.id,
      },
      include: {
        User: true,
      },
    });

    data = {
      status: 201,
      message: "Comment added successfully!",
      result: comment,
    };
  } catch (err) {
    console.log("prisma error", err);
    data = {
      status: 200,
      message: "An error occurred: " + err,
      result: "error",
    };
  }
  res.json(data);
};

export default handler;
