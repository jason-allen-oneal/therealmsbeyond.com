import GalleryLatest from "@/components/gallery/Latest";
import type { NextPage } from "next";
import Layout from "@/components/Layout";

const GalleryPage: NextPage = () => {
  const data = {
    title: "Gallery Home",
    description: "Show us your secrets.",
  };

  return (
    <>
      <Layout data={data}>
        <div className="col-start-2 col-span-4">
          <GalleryLatest />
        </div>
      </Layout>
    </>
  );
};

export default GalleryPage;
