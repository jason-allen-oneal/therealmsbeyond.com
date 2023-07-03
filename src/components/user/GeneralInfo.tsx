import { ChangeEvent, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dashboardSchema, { DashboardInput } from "@/lib/validation/dashboard";
import { useNotification } from "@/lib/contexts/notification";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  user: User;
};

const UserGeneralInfo = ({ user }: Props) => {
  const [files, setFile] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { successNotify, errorNotify } = useNotification();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DashboardInput>({
    defaultValues: {
      username: user?.name,
      email: user?.email,
      bio: user?.bio,
      password: "",
    },
  });

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (files.includes(file)) {
        continue;
      }

      if (!file.type.startsWith("image")) {
        errorNotify(`File '${file.name}' is invalid`);
        continue;
      }

      setFile((prevFiles) => {
        const newValue = [...prevFiles, file];
        return newValue;
      });
    }
  };

  const onSubmit = useCallback(
    async (data: any) => {
      setSubmitting(true);

      const input = {
        username: data.username,
        email: data.email,
        bio: data.bio,
        password: data.password,
      };

      if (input.password !== "Password" && input.password !== "") {
        input.password = data.password;
      }

      try {
        const formData = new FormData();
        for (const [key, value] of Object.entries(input)) {
          formData.append(key, value);
        }
        files.forEach((file) => {
          formData.append("avatar", file);
        });

        const request = await fetch("/api/user/profile", {
          method: "POST",
          body: formData,
        });

        const result = await request.json();

        setSubmitting(false);

        if (result.status === 201) {
          // toast success
          successNotify("You have updated your information!");
        } else {
          // toast error
          errorNotify("Something went wrong: " + result.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [errorNotify, successNotify]
  );

  return (
    <form
      className="max-w-md border-primary border-2 rounded bg-neutral text-neutral-content mx-auto p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="avatar">
        <div className="w-24 rounded-xl">
          <img src={`/images/avatars/${user?.avatar}`} />
        </div>
      </div>

      <div className="form-control my-4">
        <label className="input-group input-group-vertical">
          <span className="text-base-content">Avatar</span>
          <input
            type="file"
            onChange={onFileUploadChange}
            className="file-input file-input-sm file-input-bordered w-full text-base-content placeholder-base-content"
          />
        </label>
      </div>

      <Controller
        name="username"
        control={control}
        defaultValue={user?.name}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Username</span>
              <input
                type="text"
                className="input input-bordered text-base-content placeholder-base-content"
                {...field}
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        defaultValue={user?.email}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Email</span>
              <input
                type="text"
                placeholder="info@site.com"
                className="input input-bordered text-base-content placeholder-base-content"
                {...field}
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered text-base-content placeholder-base-content"
                {...field}
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <div className="form-control my-4">
            <label className="input-group input-group-vertical">
              <span className="text-base-content">Bio</span>
              <textarea
                rows={4}
                className="textarea textarea-bordered w-full my-2 -mt-1 bg-base-200 text-base-content placeholder-base-content"
                {...field}
              ></textarea>
            </label>
          </div>
        )}
      />

      <button
        className={`btn btn-secondary ${
          submitting ? "loading btn-disabled" : ""
        }`}
        type="submit"
        aria-disabled={submitting}
      >
        Update
      </button>
    </form>
  );
};

export default UserGeneralInfo;
