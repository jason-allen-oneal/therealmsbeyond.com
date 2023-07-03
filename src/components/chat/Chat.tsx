import { useState, useEffect, FormEvent } from "react";
import io from "socket.io-client";
import MobileChat from "./Mobile";
import FullChat from "./Full";

type Props = {
  user: User;
  rooms: ChatRooms[];
  messages: ChatMessage[];
};

const Chat = (props: Props) => {
  const user = props.user;
  const userRoom = props.rooms.find((e: Channel) => {
    return e.id === user.chat;
  });

  const [channels, setChannels] = useState<Channel[]>(props.rooms);
  const [socket, setSocket] = useState(io());
  const [channel, setChannel] = useState<Channel>(userRoom!);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState(props.messages);
  const [message, setMessage] = useState("");

  const handleChannelSelect = (id: number) => {
    let chan = channels.find((c: Channel) => {
      return c.id === id;
    });
    if (chan) {
      setChannel(chan);

      socket.emit("channel-join", chan.id);

      const body = {
        mode: "history",
        cid: chan.id,
      };

      fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        });
    }
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let ai = false;
    let msg = message;
    if (message.includes("/ai")) {
      msg = msg.replace("/ai ", "");
      ai = true;

      const body = {
        mode: "ai",
        msg: msg,
        cid: channel.id,
        cname: channel.name,
      };

      fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages((prev) => [...prev, data]);
        });
    }

    const data = {
      roomId: channel.id,
      authorId: chatUser!.id,
      message: msg,
      recipientId: 0,
      type: ai ? "ai-chat" : "chat",
    };

    socket.emit("send-message", { data: data, ai: ai });
    setMessage("");
  };

  const handleUserClick = (m: number) => {
    // pm popup
  };

  const handleMessageChange = (text: string) => {
    setMessage(text);
  };

  socket.on("connect", () => {
    console.log("connected");

    socket.on("auth-response", (cU: ChatUser) => {
      setChatUser(cU);
    });

    socket.on("channels", (chans: Channel[]) => {
      setChannels(chans);
    });

    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });
  });

  useEffect(() => {
    if (user) {
      socket.emit("auth", { user: user, channel: channel.id });
    }
  }, [user]);

  useEffect(() => {
    let chan = channels.find((c: Channel) => {
      return c.id === channel.id;
    });
    if (chan) {
      setChannel(chan);
    }
  }, [channels]);

  return (
    <>
      {messages.length === 0 && <div>Loading...</div>}
      {messages.length > 0 && (
        <div className="w-full h-screen">
          <div className="flex h-full">
            <MobileChat
              chans={channels}
              handleChannelChange={handleChannelSelect}
              handleMessageChange={handleMessageChange}
              message={message}
              handleSendMessage={handleSendMessage}
              handleUserClick={handleUserClick}
              channel={channel}
              msgs={messages}
              user={user}
            />
            <FullChat
              chans={channels}
              handleChannelChange={handleChannelSelect}
              handleMessageChange={handleMessageChange}
              message={message}
              handleSendMessage={handleSendMessage}
              handleUserClick={handleUserClick}
              channel={channel}
              msgs={messages}
              user={user}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
