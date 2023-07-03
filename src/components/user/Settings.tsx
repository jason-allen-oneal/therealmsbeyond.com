import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import settingsSchema, { SettingsInput } from "@/lib/validation/settings";
import { useNotification } from "@/lib/contexts/notification";

const UserSettings = () => {
  const { successNotify, errorNotify } = useNotification();

  const { handleSubmit, control } = useForm<SettingsInput>({
    defaultValues: {
      perPage: 12,
      pageSort: "date:desc",
    },
  });

  const onSubmit = useCallback(
    async (data: SettingsInput) => {
      const input: SettingsInput = {
        perPage: data.perPage,
        pageSort: data.pageSort,
      };
      try {
        const formData = new FormData();

        for (const [key, value] of Object.entries(input)) {
          formData.append(key, value + "");
        }

        const request = await fetch("/api/user/settings", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        const result = await request.json();

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
    [successNotify, errorNotify]
  );

  return (
    <form
      className="max-w-md border-primary border-2 rounded bg-neutral text-neutral-content mx-auto p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="perPage"
        control={control}
        render={({ field }) => (
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Default Per Page</span>
            </label>
            <select
              className="select select-bordered border-primary w-full max-w-xs my-2 bg-base-300 text-base-content"
              {...field}
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
        )}
      />

      <Controller
        name="pageSort"
        control={control}
        render={({ field }) => (
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Default Sorting</span>
            </label>
            <select
              className="select select-bordered border-primary w-full max-w-xs my-2 bg-base-300 text-base-content"
              {...field}
            >
              <option value="date:desc">Date Descending</option>
              <option value="date:asc">Date Ascending</option>
              <option value="title:desc">Title Descending</option>
              <option value="title:asc">Title Ascending</option>
            </select>
          </div>
        )}
      />

      <button type="submit" className="btn btn-secondary mt-4">
        Update Settings
      </button>
    </form>
  );
};

export default UserSettings;
