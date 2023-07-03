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

const FullChat = ({
  chans,
  msgs,
  handleChannelChange,
  handleMessageChange,
  handleSendMessage,
  message,
  channel,
  user,
}: Props) => {
  const bottomEl = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({
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
    <div className="hidden md:block bg-gray-200 w-full">
      <div className="h-full w-2/5 float-left">
        <ul className="menu bg-base-100 h-full w-1/2 inline-block align-top">
          {chans.map((c: Channel, index: number) => (
            <li
              onClick={() => handleChannelChange(c.id)}
              className={c.id == channel.id ? `bordered` : ""}
              key={index}
            >
              <a>{c.name}</a>
            </li>
          ))}
        </ul>
        <ul className="menu bg-base-100 h-full w-1/2 inline-block align-top">
          {channel.members.map((m: ChatUser, index: number) => (
            <li key={index}>{m.name}</li>
          ))}
        </ul>
      </div>
      <div className="bg-base-100 w-3/5 h-full float-right p-4">
        <div className="mb-auto h-5/6 overflow-y-auto min-h-96">
          {msgs &&
            msgs.map((msg: ChatMessage, i: number) => {
              if (msg.type == "system") {
                return (
                  <div key={i} className="message mb-4 flex">
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
              } else {
                if (user.name == msg.user.name) {
                  return (
                    <div key={i} className="message mb-4 flex text-right">
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
                    <div key={i} className="message mb-4 flex">
                      <div className="flex-1 px-2">
                        <div className="pl-4">
                          <small className="text-gray-500">
                            {msg.user.name}
                          </small>
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
                }
              }
            })}
          <div ref={bottomEl}></div>
        </div>
        <div className="h-1/6">
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

export default FullChat;
