import type { NextPage } from "next";
import Image from "next/image";
import { requireAuth } from "@/lib/requireAuth";
import { getUserById } from "@/lib/services/user";
import { getTime } from "@/lib/utils";
import Layout from "@/components/Layout";

type PageProps = {
  user: User;
};

export const getServerSideProps = requireAuth(async (ctx: any) => {
  const id = ctx?.params.params[0];
  const user = await getUserById(parseInt(id));
  console.log("user", user);
  return {
    props: {
      user: JSON.stringify(user),
    },
  };
});

const Account: NextPage<PageProps> = (props: PageProps) => {
  const user = JSON.parse(props.user);

  const pageData = {
    title: user.name + "'s Profile",
    description: user.name + "'s Profile",
  };

  return (
    <Layout data={pageData}>
      <div className="border border-primary">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                <div>
                  <img
                    src={"/images/avatars/" + user.avatar}
                    alt=""
                    className="shadow-xl rounded-full h-24 align-middle border-none max-w-150-px"
                  />
                </div>
              </div>
              <div className="w-full lg:w-4/12 px-4 lg:order-1">
                <div className="flex justify-center py-4 lg:pt-4 pt-8">
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {user._count.Article}
                    </span>
                    <span className="text-sm text-blueGray-400">Articles</span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {user._count.Gallery}
                    </span>
                    <span className="text-sm text-blueGray-400">Galleries</span>
                  </div>
                  <div className="lg:mr-4 p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                      {user._count.BlogComment + user._count.GalleryComment}
                    </span>
                    <span className="text-sm text-blueGray-400">Comments</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <h3 className="text-4xl font-semibold leading-normal text-secondary mb-2">
                {user.name}
              </h3>
              <br />
              {user.admin && (
                <div className="text-sm leading-normal mt-0 mb-2 text-secondary font-bold uppercase">
                  <p>Admin</p>
                </div>
              )}
              <div className="mb-2 text-secondary mt-10">
                <p>Joined: {getTime("short", user.joined)}</p>
              </div>
            </div>
            <div className="mt-10 py-10 border-t text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <p className="mb-4 text-lg leading-relaxed text-secondary">
                    {user.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
