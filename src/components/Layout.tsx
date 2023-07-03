import { ReactNode } from "react";
import Head from "next/head";
import NavBar from "@/components/blocks/Navbar";
import FooterBlock from "@/components/blocks/Footer";

const Layout = ({
  data,
  children,
}: {
  data: { title: string; description: string };
  children: ReactNode;
}) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <meta charSet="utf-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <title>{data.title}</title>
      </Head>

      <main className="container">
        <NavBar />
        <div className="container mx-auto">{children}</div>
        <FooterBlock />
      </main>
    </>
  );
};

export default Layout;
