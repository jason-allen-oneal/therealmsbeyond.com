import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

type BodyInput = {
  perPage: number;
  pageSort: string;
  theme: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, nextAuthOptions);
  let resultBody: APIResponse = {
    status: 200,
    message: "Error",
    result: "error",
  };
  let body: BodyInput = {
    perPage: 12,
    pageSort: "date:desc",
    theme: "trb",
  };

  const { perPage, pageSort, theme } = body;

  const settings = {
    perPage: perPage,
    pageSort: pageSort,
    theme: theme,
  };

  try {
    const updateResult = await prisma.userSettings.update({
      where: {
        uid: session?.user.id as number,
      },
      data: settings,
    });

    resultBody = {
      status: 201,
      message: "User information updated successfully",
      result: updateResult,
    };
  } catch (err) {
    console.log("update err", err);
  }

  res.json(resultBody);
}

export default handler;
