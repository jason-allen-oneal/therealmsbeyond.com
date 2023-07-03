import { useRef, useEffect, FormEvent } from "react";

type Props = {
  chans: Channel[];
  msgs: ChatMessage[];
  handleChannelChange: (c: number) => void;
  handleMessageChange: (text: string) => void;
  handleSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  handleUserClick: (m: number) => void;
  message: string;
  channel: Channel;
  user: User;
};

const MobileChat = ({
  chans,
  msgs,
  handleChannelChange,
  handleMessageChange,
  handleSendMessage,
  message,
  channel,
  user,
}: Props) => {
  const lastMsg = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    lastMsg.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (msgs) {
      scrollToBottom();
    }
  }, [msgs]);

  if (!msgs) return <>Loading...</>;

  return (
    <div className="block md:hidden lg:hidden xl:hidden w-full">
      <div className="fluid">
        <div>
          <ul>
            <li className="inline-block pr-2">
              <div className="dropdown dropdown-bottom">
                <label tabIndex={0} className="btn btn-sm">
                  Channels
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu shadow bg-base-100 w-52"
                >
                  {chans.map((c: Channel, index: number) => (
                    <li onClick={() => handleChannelChange(c.id)} key={index}>
                      <div className="indicator">
                        <span className="indicator-item indicator-middle badge badge-secondary">
                          {c.count}
                        </span>
                        <div className="">
                          <a>{c.name}</a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="inline-block pr-2">
              <div className="dropdown dropdown-bottom">
                <label tabIndex={0} className="btn btn-sm">
                  Users
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu shadow bg-base-100 w-52"
                >
                  {channel.members.map((m: ChatUser, index: number) => (
                    <li
                      onClick={() =>
                        console.log("chatUser click", JSON.stringify(m))
                      }
                      key={index}
                    >
                      {m.name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="inline-block">{channel.name}</li>
          </ul>
        </div>
        <div className="h-96">
          <div className="mb-auto h-5/6 overflow-y-auto min-h-96">
            {!msgs && <>Loading...</>}
            {msgs &&
              msgs.map((msg: ChatMessage, i: number) => {
                if (msg.type == "system") {
                  return (
                    <div ref={lastMsg} key={i} className="message mb-4 flex">
                      <div className="flex-3 px-2">
                        <div className="pl-4">
                          <small className="text-gray-500">System</small>
                        </div>
                        <div className="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                          <span>{msg.text}</span>
                        </div>
                        <div className="pl-4">
                          <small className="text-gray-500">{msg.time}</small>
                        </div>
                      </div>
                    </div>
                  );
                } else if (msg.type == "ai") {
                  return (
                    <div ref={lastMsg} key={i} className="message mb-4 flex">
                      <div className="flex-3 px-2">
                        <div className="pl-4">
                          <small className="text-gray-500">AI</small>
                        </div>
                        <div className="inline-block bg-zinc-700 rounded-full p-2 px-6 text-gray-200">
                          <span>{msg.text}</span>
                        </div>
                        <div className="pl-4">
                          <small className="text-gray-500">{msg.time}</small>
                        </div>
                      </div>
                    </div>
                  );
                } else if (msg.type === "ai-chat") {
                  return (
                    <div ref={lastMsg} key={i} className="message mb-4 flex">
                      <div className="flex-1 px-2">
                        <div className="inline-block bg-stone-700 rounded-full p-2 px-6 text-gray-200">
                          <span>
                            {msg.user.name} says to AI: {msg.text}
                          </span>
                        </div>
                        <div className="pl-4">
                          <small className="text-gray-500">{msg.time}</small>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  if (user.name == msg.user.name) {
                    return (
                      <div
                        ref={lastMsg}
                        key={i}
                        className="message mb-4 flex text-right"
                      >
                        <div className="flex-1 px-2">
                          <div className="pl-4">
                            <small className="text-gray-500">Me</small>
                          </div>
                          <div className="inline-block bg-blue-600 rounded-full p-2 px-6 text-white">
                            <span>{msg.text}</span>
                          </div>
                          <div className="pr-4">
                            <small className="text-gray-500">{msg.time}</small>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div ref={lastMsg} key={i} className="message mb-4 flex">
                        <div className="flex-1 px-2">
                          <div className="pl-4">
                            <small className="text-gray-500">
                              {msg.user.name}
                            </small>
                          </div>
                          <div className="inline-block bg-neutral-700 rounded-full p-2 px-6 text-neutral-content">
                            <span>{msg.text}</span>
                          </div>
                          <div className="pl-4">
                            <small className="text-gray-500">{msg.time}</small>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
              })}
          </div>
        </div>
        <div className="inline-block align-bottom">
          <form onSubmit={handleSendMessage}>
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  className="input input-bordered"
                  onChange={(e) => handleMessageChange(e.target.value)}
                  value={message}
                />
                <button className="btn btn-square btn-secondary" type="submit">
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileChat;
