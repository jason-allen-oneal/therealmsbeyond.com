import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import sizeOf from "image-size";
import multiparty, { File } from "multiparty";
import { normalize, randomString } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Ffmpeg from "fluent-ffmpeg";

export const config = {
  api: {
    bodyParser: false,
  },
};

type GalleryInput = {
  title: string;
  description: string;
  categoryId: number;
  slug: string;
  authorId: number;
  featured: boolean;
};

type EntryInput = {
  path: string;
  thumb?: string;
  galleryId: number;
  height: number;
  width: number;
};

type APIResult = {
  status: number;
  message: string;
  result: any;
};

const UPLOAD_DIR =
  process.env.NEXT_PUBLIC_ROOT_PATH + "/public/images/galleries/";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let resultBody: APIResult = {
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
        if (err) {
          console.log("parse error", err);
          reject(err);
        }
        resolve({ fields, files });
      });
    });

    const galleryData: GalleryInput = {
      title: fields.title[0],
      description: fields.description[0],
      categoryId: parseInt(fields.category[0]),
      slug: normalize(fields.title[0]),
      authorId: session?.user?.id as number,
      featured: false,
    };

    const galleryInsertResult = await prisma.gallery.create({
      data: galleryData,
    });

    const galleryId = galleryInsertResult.id;

    for (const file of files.uploads) {
      const newFilename = randomString(16);

      let entry: EntryInput = {
        path: "",
        thumb: "",
        galleryId: 0,
        height: 0,
        width: 0,
      };

      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const mime = file.headers["content-type"];
          if (mime.includes("video")) {
            Ffmpeg(file.path).screenshots({
              timestamps: [1],
              filename: newFilename + ".png",
              folder:
                process.env.NEXT_PUBLIC_ROOT_PATH + "/public/images/thumbnails",
            });

            Ffmpeg(file.path).ffprobe((err, metadata) => {
              if (err) console.log("probe err", err);

              resolve({
                width: metadata.streams[0].width as number,
                height: metadata.streams[0].height as number,
              });
            });
          } else if (mime.includes("image")) {
            const dimensions = sizeOf(file.path);
            resolve({
              height: dimensions.height as number,
              width: dimensions.width as number,
            });
          } else {
            reject("File type not allowed");
          }
        }
      );

      const ext = file.originalFilename.split(".").pop();

      const filePath = UPLOAD_DIR + newFilename + "." + ext;

      await fs.rename(file.path, filePath);

      entry.path = newFilename + "." + ext;
      entry.galleryId = galleryId;
      entry.height = Math.floor(dimensions.height!);
      entry.width = Math.floor(dimensions.width!);

      const mime = file.headers["content-type"];
      if (mime.includes("video")) {
        entry.thumb = newFilename + ".png";
      }

      await prisma.entry.create({
        data: entry,
      });
    }

    resultBody.message = "Gallery successfully created!";
    resultBody.result = galleryInsertResult;
  } catch (error) {
    console.log(error);
    resultBody.message = JSON.stringify(error);
    resultBody.result = "error";
  }

  res.json(resultBody);
}

export default handler;
