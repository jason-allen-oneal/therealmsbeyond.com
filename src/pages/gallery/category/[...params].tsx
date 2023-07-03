import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import {
  getCategoryById,
  getGalleriesByCategoryId,
} from "@/lib/services/gallery";
import { paginate } from "@/lib/utils";
import Layout from "@/components/Layout";
import GalleryCategoryItem from "@/components/gallery/CategoryItem";

type PageProps = {
  category: GalleryCategory;
  galleries: Gallery;
};

const GalleryCategoryPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { data: session, status } = useSession();

  const category = props.category;
  const galleries = props.galleries;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedArticles = paginate(galleries, currentPage, pageSize);

  const data = {
    title: category?.name + " Galleries",
    description: "Galleries from " + category?.name,
  };

  return (
    <>
      <Layout data={data}>
        <div className="border border-primary">
          <div className="flex justify-center mt-6 mb-8 px-4">
            <h2 className="flex-auto mb-3 text-2xl font-bold">
              Gallery Category - {category?.name}
            </h2>
            {status !== "authenticated" ? (
              <p>
                You must{" "}
                <Link href="#">
                  <a onClick={() => signIn()}>login</a>
                </Link>{" "}
                or{" "}
                <Link href="/user/register">
                  <a>register</a>
                </Link>{" "}
                to create a gallery!
              </p>
            ) : (
              <Link href={"/gallery/gallery/add/" + category?.id + "/"}>
                <a className="btn btn-secondary">Create Gallery</a>
              </Link>
            )}
          </div>
          <div className="border-2 border-primary bg-base-200 rounded p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {galleries &&
              galleries.length > 0 &&
              galleries.map((gallery: any) => (
                <GalleryCategoryItem
                  key={gallery.id}
                  gallery={gallery}
                  inCategory={true}
                />
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const id = +context.params.params[0];

  const category = await getCategoryById(id);
  const galleries = JSON.parse(
    JSON.stringify(await getGalleriesByCategoryId(id))
  );

  return {
    props: {
      category,
      galleries,
    },
  };
}

export default GalleryCategoryPage;
