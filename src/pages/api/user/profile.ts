import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import sizeOf from "image-size";
import multiparty, { File } from "multiparty";
import { normalizeName, normalize, randomString } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "argon2";

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR =
  process.env.NEXT_PUBLIC_ROOT_PATH + "/public/images/avatars/";

type ProfileUpdate = {
  username: string;
  email: string;
  password?: string;
  bio: string;
  avatar?: string;
  slug: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("req", req);
  let resultBody: APIResponse = {
    status: 200,
    message: "",
    result: "",
  };

  try {
    const session = await getServerSession(req, res, nextAuthOptions);

    const form = new multiparty.Form();

    const { fields, files } = await new Promise<{
      fields: { [key: string]: string[] };
      files: { [key: string]: File[] };
    }>((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        console.log("files inside", files);
        if (err) {
          console.log("parse error", err);
          reject(err);
        }
        resolve({ fields, files });
      });
    });

    if (files) {
      console.log("files", files);
      const file = files.avatar[0];

      const newFilename = randomString(16);
      const ext = file.originalFilename.split(".").pop();
      const filename = newFilename + "." + ext;
      const filePath = UPLOAD_DIR + filename;

      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const dimensions = sizeOf(file.path);
          resolve({
            height: dimensions.height as number,
            width: dimensions.width as number,
          });
        }
      );

      await fs.rename(file.path, filePath);

      const avatarGeneral = {
        avatar: filename,
      };
      const avatarUpdateResult = await prisma.user.update({
        where: {
          id: session?.user.id,
        },
        data: avatarGeneral,
      });

      await prisma.userSettings.update({
        where: {
          uid: session?.user.id as number,
        },
        data: {
          avatarWidth: dimensions.width,
          avatarHeight: dimensions.height,
        },
      });
    }

    const general: ProfileUpdate = {
      username: normalizeName(fields.username[0]),
      slug: normalize(fields.username[0]),
      email: fields.email[0],
      bio: fields.bio[0],
    };

    if (fields.password[0] != undefined) {
      const hashedPassword = await hash(fields.password[0] as string);
      general.password = hashedPassword;
    }

    const updateResult = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: general,
    });

    resultBody = {
      status: 201,
      message: "User information updated successfully",
      result: updateResult,
    };
  } catch (err) {
    console.log(err);
    resultBody = {
      status: 200,
      message: JSON.stringify(err),
      result: "error",
    };
  }

  res.json(resultBody);
}

export default handler;
