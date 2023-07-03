import type { NextPage } from "next";
import { ChangeEvent, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { getCategorySelectOptions } from "@/lib/utils";
import { requireAuth } from "@/lib/requireAuth";
import { getCategoryById, getAllCategories } from "@/lib/services/gallery";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "@/components/Layout";
import gallerySchema, { GalleryInput } from "@/lib/validation/gallery";
import { useNotification } from "@/lib/contexts/notification";
import { useRouter } from "next/router";

type PageProps = {
  category: GalleryCategory;
  cats: GalleryCategory[];
};

const GalleryAddPage: NextPage<PageProps> = ({ category, cats }: PageProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isPublic] = useState<boolean>(true);
  const { successNotify, errorNotify } = useNotification();

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<GalleryInput>({
    defaultValues: {
      title: "",
      description: "",
      category: 0,
    },
  });

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (files.includes(file)) {
        continue;
      }

      if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
        errorNotify(`File '${file.name}' is invalid`);
        continue;
      }

      setFiles((prevFiles) => {
        const newValue = [...prevFiles, file];
        return newValue;
      });
    }
  };

  const removeImage = (name: string) => {
    setFiles(files.filter((x) => x.name !== name));
  };

  const onSubmit = useCallback(
    async (data: any) => {
      if (files.length === 0) {
        errorNotify("You must select at least one video or image to upload.");
        return;
      }

      setSubmitting(true);

      const input = {
        title: data.title,
        description: data.description,
        category: data.category as number,
        isPublic: isPublic,
      };

      try {
        const formData = new FormData();
        for (const [key, value] of Object.entries(input)) {
          formData.append(key, value);
        }
        files.forEach((file) => {
          formData.append("uploads", file);
        });

        const request = await fetch("/api/gallery/add/gallery", {
          method: "POST",
          body: formData,
        });

        const result = await request.json();

        setSubmitting(false);

        if (result.status == 200) {
          const url = `/gallery/gallery/${result.result.id}/${result.result.slug}`;
          successNotify(result.message, () => {
            reset();
            setFiles([]);
            router.push(url);
          });
        } else {
          errorNotify(result.message, () => {
            reset();
            setFiles([]);
          });
        }
      } catch (err) {
        console.error(err);
        errorNotify(JSON.stringify(err));
      }
    },
    [files, reset, router]
  );

  const options = getCategorySelectOptions(cats, category?.id);

  const pageData = {
    title: "Add Gallery",
    description: "",
  };

  return (
    <Layout data={pageData}>
      <div className="border border-primary">
        <>
          <h2 className="p-4 mb-3 text-3xl font-bold title">Add New Gallery</h2>
          <div className="mt-8 mb-6 flex justify-center px-4">
            <>
              <form
                className="p-4 bg-neutral text-neutral-content shadow-lg rounded-lg border-2 border-primary max-w-sm"
                onSubmit={handleSubmit(onSubmit)}
              >
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    className={`input input-bordered border-primary w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content ${
                      errors.title ? "input-error" : ""
                    }`}
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-error">
                      {errors.title?.message}
                    </p>
                  )}

                  <textarea
                    className={`textarea textarea-bordered border-primary w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content ${
                      errors.description ? "textarea-error" : ""
                    }`}
                    placeholder="Description..."
                    {...register("description")}
                  ></textarea>
                  {errors.description && (
                    <p className="text-sm text-error">
                      {errors.description?.message}
                    </p>
                  )}

                  <label className="mt-4">
                    <select
                      className={`select select-bordered border-primary w-full max-w-xs my-2 bg-base-300 text-base-content ${
                        errors.category ? "select-error" : ""
                      }`}
                      {...register("category")}
                    >
                      <option>Choose Category...</option>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {errors.category && (
                    <p className="text-sm text-error">
                      {errors.category?.message}
                    </p>
                  )}

                  <label
                    className="block mb-2 font-medium mt-4"
                    htmlFor="file_upload"
                  >
                    Upload:
                  </label>
                  <input
                    className={`block w-full border border-primary rounded-lg cursor-pointer focus:outline-none`}
                    id="file_upload"
                    type="file"
                    multiple
                    onChange={onFileUploadChange}
                  />

                  <div className="pt-6 text-center">
                    <button
                      className={`btn btn-secondary ${
                        submitting ? "loading btn-disabled" : ""
                      }`}
                      type="submit"
                      aria-disabled={submitting}
                    >
                      Add!
                    </button>
                  </div>

                  {files.length > 0 && (
                    <>
                      <button
                        onClick={() => setFiles([])}
                        className="mb-3 btn btn-secondary btn-sm font-sm text-sm"
                      >
                        Clear Files
                      </button>

                      <div className="grid grid-cols-1 justify-start">
                        {files.map((file, idx) => (
                          <div key={idx} className="overflow-hidden relative">
                            <a
                              onClick={() => {
                                removeImage(file.name);
                              }}
                              href="#"
                              className="btn btn-secondary btn-sm cursor-pointer"
                            >
                              X
                            </a>
                            {file.type.startsWith("image") && (
                              <img
                                className="w-60 rounded-md"
                                src={URL.createObjectURL(file)}
                              />
                            )}
                            {file.type.startsWith("video") && (
                              <video className="w-60 rounded-md">
                                <source src={URL.createObjectURL(file)} />
                              </video>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              </form>
            </>
          </div>
        </>
      </div>
    </Layout>
  );
};

export const getServerSideProps = requireAuth(async (ctx: any) => {
  const id = +ctx.params.params[0];

  const category = await getCategoryById(id);
  const cats = await getAllCategories();

  return {
    props: {
      category,
      cats,
    },
  };
});

export default GalleryAddPage;
