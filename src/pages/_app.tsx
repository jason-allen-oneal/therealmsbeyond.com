import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "nprogress/nprogress.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NotificationContextProvider } from "@/lib/contexts/notification";
import dynamic from "next/dynamic";

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps["pageProps"];
}

const TopProgressBar = dynamic(
  () => {
    return import("@/components/TopProgressBar");
  },
  {
    ssr: false,
  }
);

const CustomApp = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <NotificationContextProvider>
        <TopProgressBar />
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          draggable={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </NotificationContextProvider>
    </SessionProvider>
  );
};

export default CustomApp;
