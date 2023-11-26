import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import XIcon from "../icons/XIcon";
import clsx from "clsx";

export default function SlideOverWideEmpty({
  title,
  description,
  open,
  children,
  onClose,
  className,
  buttons,
  withTitle = true,
  withClose = true,
  overflowYScroll,
}: {
  title?: string;
  description?: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  buttons?: ReactNode;
  withTitle?: boolean;
  withClose?: boolean;
  overflowYScroll?: boolean;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={clsx("pointer-events-auto w-screen max-w-2xl overflow-auto border border-gray-200 text-gray-800 shadow-lg", className)}
                >
                  <div className="flex h-full flex-col overflow-y-auto bg-white pt-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        {withTitle ? (
                          <div className="flex flex-col">
                            <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
                            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
                          </div>
                        ) : (
                          <div>
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <svg
                                className="h-6 w-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                              </svg>
                            </button>
                          </div>
                        )}

                        <div className="ml-3 flex h-7 items-center space-x-4">
                          {buttons}
                          {withClose && (
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={clsx("relative mt-6 flex-1 border-t bg-gray-50 px-4 pb-6 pt-5 sm:px-6", overflowYScroll && "overflow-y-scroll")}>
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
