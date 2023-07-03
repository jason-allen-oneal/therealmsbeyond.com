import { useState, useEffect } from "react";
import GalleryCategoryItem from "./CategoryItem";

const GalleryLatest = () => {
  const [data, setData] = useState<Gallery[]>();

  useEffect(() => {
    fetch("/api/gallery/latest")
      .then((res) => res.json())
      .then((data) => {
        setData(data?.result);
      });
  }, []);

  const galleries = data;

  if (galleries != undefined) {
    for (let i = 0; i < galleries.length; i++) {
      galleries[i].image =
        galleries[i].Entry[
          Math.floor(Math.random() * galleries[i].Entry.length)
        ].thumb;
    }
  }

  return (
    <>
      <h2 className="mb-3 text-3xl font-bold">From the Galleries...</h2>
      <div className="border-2 border-primary bg-base-200 rounded p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {galleries &&
          galleries.length > 0 &&
          galleries.map((gallery: Gallery) => (
            <GalleryCategoryItem key={gallery.id} gallery={gallery} />
          ))}
      </div>
    </>
  );
};

export default GalleryLatest;
