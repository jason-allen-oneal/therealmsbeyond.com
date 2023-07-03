import type { NextPage } from "next";
import {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import type { Session } from "next-auth";
import { requireAuth } from "@/lib/requireAuth";
import { getChannels, getUserChannel } from "@/lib/services/chat";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import Layout from "@/components/Layout";
import Chat from "@/components/chat/Chat";

export const getServerSideProps = requireAuth(
  async <Q extends ParsedUrlQuery, D extends PreviewData>(
    ctx: GetServerSidePropsContext<Q, D>
  ) => {
    const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);
    const user = session!.user;

    const msgs = await getUserChannel(user.chat);

    const rooms = JSON.stringify(await getChannels());

    return {
      props: {
        chatRooms: rooms,
        messages: msgs,
        session,
      },
    };
  }
);

type PageProps = {
  chatRooms: Room[];
  messages: ChatMessage[];
  session: Session;
};

const ChatPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const chatRooms: Channel[] = [];
  for (const room of JSON.parse(props.chatRooms)) {
    const obj = {
      id: room.id,
      name: room.name,
      count: 0,
      members: [],
    };
    chatRooms.push(obj);
  }

  const user = props.session.user;

  if (!user) {
    return <>Loading...</>;
  }

  const pageData = {
    title: "Chat",
    description: "Chat",
  };

  return (
    <Layout data={pageData}>
      <div className="border border-secondary p-4">
        <Chat rooms={chatRooms} messages={props.messages} user={user} />
      </div>
    </Layout>
  );
};

export default ChatPage;
