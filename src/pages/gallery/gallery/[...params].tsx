import type { NextPage } from "next";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getTime, getImageDimensions } from "@/lib/utils";
import { getGallery } from "@/lib/services/gallery";
import Layout from "@/components/Layout";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";
import CommentSection from "@/components/blocks/CommentSection";
import GalleryBox from "@/components/gallery/GalleryBox";

type PageProps = {
  gallery: Gallery;
};

const GalleryGalleryPage: NextPage<PageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [open, setOpen] = useState<boolean>(false);
  const [slide, setSlide] = useState<number>(0);

  const gallery = props.gallery;
  const category = gallery?.GalleryCategory;

  const pageData = {
    title: "Gallery - " + gallery?.title,
    description: gallery?.title,
  };

  const handleClick = (index: number) => {
    setSlide(index);
    setOpen(true);
  };

  const slides = [];
  for (const entry of gallery?.Entry) {
    slides.push({
      url: `/images/galleries/${entry.path}`,
      type: entry.thumb === "" ? "photo" : "video",
    });
  }

  return (
    <Layout data={pageData}>
      <div className="border border-primary x-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
        <div>
          <div className="flex justify-between items-center rounded-t border-t-2 border-l-2 border-r-2 border-primary p-4 bg-base-200">
            <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
              <div className="flex-shrink-0">
                <div>
                  <div className="w-20 ml-6">
                    <Image
                      src={"/images/avatars/" + gallery.User.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <p>
                    <Link
                      href={`/user/profile/${gallery.User.id}/${gallery.User.slug}/`}
                    >
                      <a className="font-semibold text-sm text-base-content">
                        {gallery.User.name}
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
              <div className="grow">
                <div className="grid sm:flex sm:justify-between sm:items-center gap-2">
                  <div>
                    <ul className="text-xs text-base-content">
                      <li className="inline-block relative pr-6 last:pr-0 last-of-type:before:hidden before:absolute before:top-1/2 before:right-2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gray-300 before:rounded-full dark:before:bg-gray-600">
                        {getTime("short", gallery.date)}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Breadcrumbs
                      base="gallery"
                      parent={category}
                      item={gallery.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5 md:space-y-8 bg-base-100 px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 shadow-xl rounded-b border-b-2 border-l-2 border-r-2 border-primary">
            <div className="space-y-3">
              <h2 className="flex-auto mb-3 text-2xl font-bold leading-8 tracking-tight">
                {gallery.title}
              </h2>
              <div className="max-h-96">
                <div className="w-full carousel flex">
                  {gallery?.Entry &&
                    gallery?.Entry.map((entry: Entry, index: number) => (
                      <div
                        key={entry.id}
                        id={"entry-" + entry.id}
                        className="carousel-item h-full text-center relative flex flex-col"
                      >
                        {entry.thumb.trim() === "" ? (
                          <Image
                            src={`/images/galleries/${entry.path}`}
                            width={100}
                            height={100}
                            className="w-100 h-100"
                            alt={"entry-" + entry.id}
                            onClick={() => handleClick(index)}
                          />
                        ) : (
                          <Image
                            src={`/images/thumbnails/${entry.thumb}`}
                            width={100}
                            height={100}
                            className="w-100 h-100"
                            alt={"entry-" + entry.id}
                            onClick={() => handleClick(index)}
                          />
                        )}
                      </div>
                    ))}
                </div>
                {open && (
                  <GalleryBox
                    data={slides}
                    startIndex={slide}
                    showResourceCount={true}
                    onCloseCallback={() => setOpen(false)}
                    onNavigationCallback={(currentIndex: number) =>
                      console.log(`Current index: ${currentIndex}`)
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="pt-10">
            <CommentSection
              type="gallery"
              gallery={gallery}
              comments={gallery.GalleryComment}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const id = +context.params.params[0];

  const gallery = JSON.parse(JSON.stringify(await getGallery(id)));

  return {
    props: {
      gallery,
    },
  };
}

export default GalleryGalleryPage;
