import type { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { nextAuthOptions } from "@/lib/auth";
import { useState } from "react";
import { requireAuth } from "@/lib/requireAuth";
import Layout from "@/components/Layout";
import UserGeneralInfo from "@/components/user/GeneralInfo";
import UserSettings from "@/components/user/Settings";

export const getServerSideProps = requireAuth(async (ctx) => {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, nextAuthOptions),
    },
  };
});

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>("general");

  const handleTab = (index: string) => {
    setActiveTab(index);
  };

  const pageData = {
    title: "User Dashboard",
    description: "Personal information.",
  };

  return (
    <Layout data={pageData}>
      <div className="border border-primary x-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="tabs pt-8 justify-center">
          <button
            type="button"
            className={`tab tab-bordered ${
              activeTab == "general" ? "tab-active" : ""
            }`}
            id="dashboard-general"
            onClick={() => handleTab("general")}
          >
            General
          </button>
          <button
            type="button"
            className={`tab tab-bordered ${
              activeTab == "settings" ? "tab-active" : ""
            }`}
            id="dashboard-settings"
            onClick={() => handleTab("settings")}
          >
            Settings
          </button>
        </div>
        <div id="tabs-contents">
          <div
            className={`${activeTab == "general" ? "" : "hidden"}`}
            id="dashboard-general-content"
          >
            <UserGeneralInfo user={session?.user} />
          </div>
          <div
            id="dashboard-settings-content"
            className={`${activeTab == "settings" ? "" : "hidden"} tab-content`}
          >
            <UserSettings />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
