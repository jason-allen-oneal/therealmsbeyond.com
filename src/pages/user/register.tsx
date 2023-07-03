import type { NextPage } from "next";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import Layout from "@/components/Layout";
import { useNotification } from "@/lib/contexts/notification";

const Register: NextPage = () => {
  const router = useRouter();
  const { successNotify, errorNotify } = useNotification();

  const { handleSubmit, control, reset } = useForm<RegisterInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (data: RegisterInput) => {
    try {
      const request = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await request.json();

      if (result.status === 201) {
        successNotify(
          "You have registered an account and may now login!",
          () => {
            reset();
            router.push("/user/login/");
          }
        );
      } else {
        errorNotify(result.message);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const data = {
    title: "Register",
    description: "Register an account.",
  };

  return (
    <>
      <Layout data={data}>
        <div className="border border-primary">
          <div className="mt-8 mb-6 flex justify-center px-4">
            <form
              className="flex items-center justify-center w-full max-w-sm"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="card w-96 bg-neutral text-neutral-content shadow-xl border-2 border-primary rounded-lg">
                <div className="card-body">
                  <h2 className="card-title">Create an account!</h2>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        placeholder="Type your username..."
                        className="input input-bordered w-full max-w-xs my-2  bg-base-300 text-base-content placeholder-base-content"
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="email"
                        placeholder="Type your email..."
                        className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
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
                        placeholder="Type your password..."
                        className="input input-bordered w-full max-w-xs my-2 bg-base-300 text-base-content placeholder-base-content"
                        {...field}
                      />
                    )}
                  />

                  <div className="card-actions items-center justify-between">
                    <p>
                      Already have an account?{" "}
                      <Link href="/user/login" className="link">
                        Go to login.
                      </Link>
                    </p>
                    <button className="btn btn-secondary" type="submit">
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;
