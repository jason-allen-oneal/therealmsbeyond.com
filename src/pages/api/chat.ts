import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getTime } from "@/lib/utils";
import { Configuration, OpenAIApi } from "openai";
import { storeMessage } from "../../lib/services/chat";

const aiConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data: any = {};

  let { body } = req;
  body = JSON.parse(body);
  const { mode, cid } = body;
  switch (mode) {
    case "ai":
      const { msg, cname } = body;
      try {
        const openai = new OpenAIApi(aiConfig);
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant for an adult sexuality community and sex store. You are a bit sexually deviant, yourself.",
            },
            { role: "user", content: msg },
          ],
          max_tokens: 512,
          n: 1,
          temperature: 0.5,
        });

        const text = response!.data!.choices[0]!.message!.content!;

        const insert = {
          roomId: cid,
          authorId: 2,
          message: text,
          recipientId: 0,
          type: "ai",
        };

        const inserted = await storeMessage(insert);
        if (inserted) {
          const message = await prisma.chatMessages.findFirst({
            where: {
              id: inserted.id,
            },
            include: {
              User: true,
              ChatRooms: true,
            },
          });

          if (message) {
            data = {
              id: message.id,
              text: message.message,
              time: getTime("since", message.time),
              user: {
                id: message.User.id,
                name: message.User.name,
                avatar: message.User.avatar,
                socket: message.User.socket,
              },
              channel: {
                id: message.ChatRooms.id,
                name: message.ChatRooms.name,
              },
              type: "ai",
            };
          }
        }
      } catch (error: any) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
      break;

    case "history":
      const messages = await prisma?.chatMessages.findMany({
        where: {
          roomId: cid,
          recipientId: 0,
        },
        include: {
          User: true,
          ChatRooms: true,
        },
      });

      data = [];
      for (const msg of messages) {
        const obj = {
          text: msg.message,
          time: getTime("since", msg.time),
          user: {
            id: msg.User.id,
            name: msg.User.name,
            avatar: msg.User.avatar,
            socket: msg.User.socket,
          },
          channel: {
            id: msg.ChatRooms.id,
            name: msg.ChatRooms.name,
          },
          type: msg.type,
        };

        data.push(obj);
      }
      break;
  }

  res.json(data);
}
