import type { NextPage } from "next";
import Layout from "../components/Layout";
import BlogLatest from "../components/blog/Latest";
import GalleryLatest from "../components/gallery/Latest";

const Home: NextPage = () => {
  const data = {
    title: "Home",
    description: "Your one stop for sexuality.",
  };

  return (
    <Layout data={data}>
      <div className="border border-primary x-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto grid grid-cols-1 gap-4">
        <div className="container w-full mx-auto flex flex-col">
          <GalleryLatest />
        </div>
        <div className="container w-full mx-auto flex flex-col">
          <BlogLatest />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
