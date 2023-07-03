import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import Layout from "@/components/Layout";
import { useNotification } from "@/lib/contexts/notification";

const Login: NextPage = () => {
  const router = useRouter();
  const { errorNotify } = useNotification();

  const { handleSubmit, control, reset, register } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
      callbackUrl: "/",
    },
  });

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await signIn("credentials", { ...data });
        reset();
      } catch (err) {
        errorNotify("Something went wrong: " + err);
        reset();
      }
    },
    [reset]
  );

  const data = {
    title: "Login",
    description: "Login to your account.",
  };

  return (
    <Layout data={data}>
      <div className="border border-primary">
        <div className="mt-8 mb-6 flex justify-center px-4">
          <form
            className="p-4 bg-neutral text-neutral-content shadow-lg rounded-lg border-2 border-primary max-w-sm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  type="email"
                  className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                  placeholder="Email Address"
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  type="password"
                  className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                  placeholder="Password"
                  {...field}
                />
              )}
            />

            <div className="flex justify-between items-center mb-6">
              <a href="#!" className="transition duration-200 ease-in-out">
                Forgot password?
              </a>
            </div>
            <input
              type="hidden"
              {...register("callbackUrl")}
              value={router.query.callbackUrl}
            />
            <button type="submit" className={`btn btn-secondary`}>
              Sign In
            </button>
            <p className="mt-6 text-center">
              Not a member?{" "}
              <Link href="/user/register/">
                <a>Register Now!</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
