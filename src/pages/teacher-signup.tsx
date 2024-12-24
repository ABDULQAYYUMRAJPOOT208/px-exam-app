import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const response = await axios.post("/api/auth/register-teacher", {
        email,
        password,
        name,
      });

      if (response.status === 201) {
        toast.success("Teacher registered successfully");
        setEmail("");
        setPassword("");
        setName("");
        window.location.href = "/auth-teacher";
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Email already exists");
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error("Invalid email or password");
      } else {
        toast.error("An unexpected error occurred");
      }
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
            <div className="relative">
              <label
                className="block my-3 text-sm font-medium text-zinc-600 dark:text-zinc-200"
                htmlFor="email"
              >
                Name
              </label>
              <input
                placeholder="you@example.com"
                className="block w-full px-4 py-3 mt-2 text-zinc-800 bg-white border-2 rounded-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 focus:border-red-500 dark:focus:border-red-400 focus:ring-opacity-50 focus:outline-none focus:ring focus:ring-red-400"
                name="name"
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
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
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-10">
              <button
                className="w-full mx-auto px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-red-400 dark:focus:ring-red-800"
                type="submit"
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-red-200 dark:bg-zinc-800">
          <div className="text-sm text-red-900 dark:text-red-300 text-center">
            Already have an account?
            <Link className="font-medium underline" href="auth-teacher">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
