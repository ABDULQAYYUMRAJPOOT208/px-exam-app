import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter required email or password");
    }
    try {
      const response = await axios.post("/api/auth/sign-in-teacher", {
        email,
        password,
      });
      if (response.status == 200) {
        toast.success("Teacher have signed in successfully");
        router.push("/exams");
      }
    } catch (e) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <ToastContainer />
      <div className="sign-up-header">
        <h1 className="mt-20 text-4xl font-bold text-zinc-800 dark:text-white">
          Proceed For Further Actions
        </h1>
      </div>

      <form
        className=" bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border-4 border-red-400 dark:border-red-800 mt-10 max-w-[80%]"
        onSubmit={handleSubmit}
      >
        <div className="px-8 py-10 md:px-10">
          <h2 className="text-4xl font-extrabold text-center text-zinc-800 dark:text-white">
            Welcome Back!
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mt-3">
            We missed you, sign in to continue.
          </p>
          <div className="mt-10">
            <div className="relative">
              <label
                className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200"
                htmlFor="email"
              >
                Email
              </label>
              <input
                placeholder="you@example.com"
                className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-red-500 dark:focus:border-red-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-red-400"
                name="email"
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <label
                className="block mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-200"
                htmlFor="password"
              >
                Password
              </label>
              <input
                placeholder="••••••••"
                className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-red-500 dark:focus:border-red-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-red-400"
                name="password"
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-10 w-full flex ">
              <button
                className="mx-auto w-full tracking-wide text-white transition-colors duration-200 transform bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-400 dark:focus:ring-red-800"
                type="submit"
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-red-200 dark:bg-zinc-800">
          <div className="text-sm text-red-900 dark:text-red-300 text-center">
            Don't have an account?
            <Link className="font-medium underline" href="teacher-signup">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
