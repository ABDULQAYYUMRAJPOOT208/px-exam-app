import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>px-examination-app</title>
        <meta name="description" content="An online examination platform" />
      </Head>
      <ToastContainer position="top-right" autoClose={3000} />
      <Component {...pageProps} />
    </>
  );
}
