import { Transition } from "@headlessui/react";
import type { ReactNode } from "react";
import { Fragment, useRef, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { Link, useParams } from "@remix-run/react";
import LogoDark from "~/assets/img/logo-dark.png";
import { useElementScrollRestoration } from "~/utils/app/scroll-restoration";
import GitHubIcon from "../ui/icons/GitHubIcon";

interface Props {
  layout: "app" | "admin" | "docs";
  children: ReactNode;
}

export default function SidebarLayout({ layout, children }: Props) {
  const params = useParams();

  const mainElement = useRef<HTMLElement>(null);
  useElementScrollRestoration({ apply: true }, mainElement);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-800">
        {/*Mobile sidebar */}
        <div className="md:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex">
              <Transition
                as={Fragment}
                show={sidebarOpen}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0">
                  <div className="absolute inset-0 bg-gray-800 opacity-75" />
                </div>
              </Transition>

              <Transition
                as={Fragment}
                show={sidebarOpen}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900">
                  <div className="absolute right-0 top-0 -mr-14 mt-2 p-1">
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-sm focus:bg-gray-600 focus:outline-none"
                      aria-label="Close sidebar"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                      <svg className="h-7 w-7 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-3 px-2">
                      <div className="flex flex-col space-y-2">
                        <Link to={"/"}>
                          <img className={"mx-auto h-8 w-auto"} src={LogoDark} alt="Logo" />
                        </Link>
                      </div>
                      <SidebarMenu layout={layout} onSelected={() => setSidebarOpen(!sidebarOpen)} />
                    </nav>
                  </div>
                </div>
              </Transition>
              <div className="w-14 flex-shrink-0">{/*Dummy element to force sidebar to shrink to fit close icon */}</div>
            </div>
          )}
        </div>

        {/*Desktop sidebar */}
        <div
          className={
            sidebarOpen
              ? "hidden transition duration-1000 ease-in"
              : "hidden overflow-x-hidden border-r border-theme-200 shadow-sm dark:border-r-0 dark:border-theme-800 dark:shadow-lg md:flex md:flex-shrink-0"
          }
        >
          <div className="flex w-64 flex-col">
            <div className="flex h-0 flex-1 flex-col bg-theme-600 shadow-md">
              <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 select-none space-y-3 bg-gray-900 px-2 py-4">
                  <div className="flex flex-col space-y-2">
                    <Link to={"/"}>
                      <img className={"mx-auto h-8 w-auto"} src={LogoDark} alt="Logo" />
                    </Link>
                  </div>
                  <SidebarMenu layout={layout} />
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/*Content */}
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <div className="relative flex h-14 flex-shrink-0 border-b border-gray-200 bg-white shadow-inner">
            <button
              className="border-r border-gray-200 px-4 text-gray-600 focus:bg-gray-100 focus:text-gray-600 focus:outline-none"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <NavBar title={"Admin"} />
          </div>

          <main ref={mainElement} className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none" tabIndex={0}>
            <div key={params.tenant} className="pb-20 sm:pb-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavBar({ title }: { title?: string }) {
  return (
    <div className="flex flex-1 justify-between space-x-2 px-3">
      <div className="flex flex-1 items-center">
        <div className="font-extrabold">{title}</div>
      </div>
      <a href="https://github.com/AlexandroMtzG/remix-workflows">
        <GitHubIcon className="h-6 w-6 text-gray-800 hover:text-gray-600" />
      </a>
    </div>
  );
}
