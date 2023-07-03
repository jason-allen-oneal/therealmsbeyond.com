import { useState, useEffect, useContext } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type Category = GalleryCategory | BlogCategory;
interface Result {
  gallery: GalleryCategory[];
  blog: BlogCategory[];
}

function NavBar() {
  const [data, setData] = useState<Result>();
  const { data: session } = useSession();

  let userLinks: React.ReactNode;

  useEffect(() => {
    fetch("/api/site")
      .then((res) => res.json())
      .then((data) => {
        setData(data.result);
      });
  }, []);

  if (session) {
    userLinks = (
      <>
        <li>
          <Link href="/user/dashboard/">Dashboard</Link>
        </li>
        <li>
          <Link onClick={() => signOut()} href="#">
            Logout
          </Link>
        </li>
      </>
    );
  } else {
    userLinks = (
      <>
        <li>
          <Link
            href="#"
            onClick={() =>
              signIn("credentials", {
                callbackUrl: `${window.location.href}`,
              })
            }
          >
            Login
          </Link>
        </li>
        <li>
          <Link href="/user/register/">Register</Link>
        </li>
      </>
    );
  }

  const gallery = data?.gallery;
  const blog = data?.blog;

  return (
    <div className="navbar bg-neutral text-neutral-content">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li tabIndex={0}>
              <a className="justify-between">
                Blog
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2 bg-neutral">
                {blog &&
                  blog.length > 0 &&
                  blog.map((cat: Category, index: number) => (
                    <li key={index}>
                      <Link href={`/blog/category/${cat.id}/${cat.slug}/`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            <li tabIndex={1}>
              <a className="justify-between">
                Gallery
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2 bg-neutral">
                {gallery &&
                  gallery.length > 0 &&
                  gallery.map((cat: Category, index: number) => (
                    <li key={index}>
                      <Link href={`/gallery/category/${cat.id}/${cat.slug}/`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            <li tabIndex={2}>
              <Link href="/chat/">Chat</Link>
            </li>

            <li tabIndex={3}>
              <a className="justify-between">
                Account
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2 bg-neutral rounded-box">{userLinks}</ul>
            </li>
          </ul>
        </div>
        <div className="flex-1 px-2 mx-2">
          <img src="/images/logo-dark.png" className="w-26 h-12" alt="logo" />
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li tabIndex={0}>
            <a>
              Blog
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-neutral rounded-box">
              {blog &&
                blog.length > 0 &&
                blog.map((cat: Category, index: number) => (
                  <li key={index}>
                    <Link href={`/blog/category/${cat.id}/${cat.slug}/`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </li>

          <li tabIndex={1}>
            <a>
              Gallery
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-neutral rounded-box">
              {gallery &&
                gallery.length > 0 &&
                gallery.map((cat: Category, index: number) => (
                  <li key={index}>
                    <Link href={`/gallery/category/${cat.id}/${cat.slug}/`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </li>

          <li tabIndex={2}>
            <Link href="/chat/">Chat</Link>
          </li>

          <li tabIndex={3}>
            <a>
              Account
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-neutral rounded-box">{userLinks}</ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
