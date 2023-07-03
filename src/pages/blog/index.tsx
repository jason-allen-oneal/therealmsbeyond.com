import type { NextPage } from "next";
import Layout from "@/components/Layout";
import BlogLatest from "@/components/blog/Latest";

const BlogPage: NextPage = () => {
  const data = {
    title: "Blog Home",
    description: "Tell us your secrets.",
  };

  return (
    <Layout data={data}>
      <div className="col-start-2 col-span-4">
        <BlogLatest />
      </div>
    </Layout>
  );
};

export default BlogPage;
