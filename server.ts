import next, { NextApiHandler } from "next";
import express, { Express, Request, Response } from "express";
import * as http from "http";
import * as socketio from "socket.io";
import { prisma } from "./src/lib/prisma";
import { getChannels, storeMessage } from "./src/lib/services/chat";
import { updateUser } from "./src/lib/services/user";
import { getTime } from "./src/lib/utils";

export interface ChatUser {
  [key: string]: number | string | Room | null;
  id: number;
  name: string;
  avatar: string;
  socket: string;
  channel: number;
}

export type Channel = {
  id: number;
  name: string;
  count: number;
  members: ChatUser[];
};

export type Room = {
  id: number;
  name: string;
  creator: number;
  date: Date;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const port: number = parseInt(process.env.PORT || "3000", 10);
const dev: boolean = process.env.NODE_ENV !== "production";

const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);

  let chatUser: ChatUser | null = null;
  const chatRooms: Channel[] = [];
  for (const room of await getChannels()) {
    const obj = {
      id: room.id,
      name: room.name,
      count: 0,
      members: [],
    };
    chatRooms.push(obj);
  }

  const io = new socketio.Server();
  io.attach(server);

  function joinChannel(channelId: number): void {
    // Find the channel to join
    const channelToJoin = chatRooms.find((channel) => channel.id === channelId);

    if (channelToJoin) {
      // Remove chatUser from any chatRoom's member property and decrement count
      chatRooms.forEach((channel) => {
        channel.members = channel.members.filter(
          (member: ChatUser) => member.id !== chatUser!.id
        );
        channel.count = channel.members.length;
      });

      // Update chatUser channel property
      chatUser!.channel = channelId;

      // Add chatUser to the appropriate channel and increment count
      channelToJoin.members.push(chatUser!);
      channelToJoin.count = channelToJoin.members.length;
    }
  }

  io.on("connection", (socket) => {
    function sysMsg(text: string, channelId: number, audiance: string): void {
      const chan = chatRooms.find((channel) => channel.id === channelId);

      const obj = {
        id: 0,
        text: text,
        time: getTime("since", new Date()),
        user: {
          id: 3,
          name: "System",
          avatar: "",
          socket: "",
        },
        channel: chan,
        type: "system",
      };

      if (audiance === "public") {
        io.emit("message", obj);
      } else {
        socket.emit("message", obj);
      }
    }

    socket.on("auth", ({ user, channel }: { user: any; channel: number }) => {
      chatUser = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        socket: socket.id,
        channel: channel,
      };

      updateUser({ id: user.id, socket: socket.id });

      socket.emit("auth-response", chatUser);
      sysMsg(`${chatUser.name} has joined.`, channel, "public");
      joinChannel(channel);
      io.emit("channels", chatRooms);

      sysMsg(
        "Please be civil in chat. You can talk to AI by typing '/ai' before your message.",
        channel,
        "private"
      );
    });

    socket.on("channel-join", (id: number) => {
      sysMsg(`${chatUser!.name} has left.`, chatUser!.channel, "public");
      joinChannel(id);
      io.emit("channels", chatRooms);
      updateUser({ id: chatUser!.id, chat: id });
      sleep(3000).then(() => {
        sysMsg(`${chatUser!.name} has joined.`, chatUser!.channel, "public");
      });
    });

    socket.on("send-message", async ({ data }: { data: any }) => {
      const msg = await storeMessage(data);
      if (msg) {
        const message = await prisma.chatMessages.findFirst({
          where: {
            id: msg.id,
          },
          include: {
            User: true,
            ChatRooms: true,
          },
        });

        if (message) {
          const obj = {
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
            type: message.type,
          };

          io.emit("message", obj);
        }
      }
    });

    socket.on("send-private-message", async (data: any) => {
      const obj = {
        text: data.message,
        time: new Date(),
        from: {
          id: data.from.id,
          name: data.from.name,
          avatar: data.from.avatar,
          socket: data.from.socket,
        },
        to: {
          id: data.to.id,
          name: data.to.name,
          avatar: data.to.avatar,
          socket: data.to.socket,
        },
      };

      socket.to(data.to.socket).emit("private-message", obj);
    });

    socket.on("disconnect", () => {
      sysMsg(`${chatUser!.name} has left.`, chatUser!.channel, "public");
      chatRooms.forEach((c: Channel) => {
        const findUser = c.members.find((e) => e.id === chatUser!.id);
        let index = c.members.indexOf(findUser!);
        if (index != -1) {
          c.members.splice(index, 1);
          c.count--;
        }
      });
      io.emit("channels", chatRooms);
    });
  });

  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
