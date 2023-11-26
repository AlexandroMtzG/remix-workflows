import { ReactNode, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  className?: string;
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  padding?: "none" | "sm";
}
export default function Modal({ className, children, open, setOpen, size = "3xl", padding = "sm" }: Props) {
  function onClose() {
    setOpen(false);
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto text-gray-800" onClose={onClose}>
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                className,
                "relative inline-block w-full transform overflow-visible rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:align-middle",
                padding === "sm" && "px-4 pb-4 pt-5 sm:my-8 sm:p-6",
                size === "sm" && "sm:max-w-sm",
                size === "md" && "sm:max-w-md",
                size === "lg" && "sm:max-w-lg",
                size === "xl" && "sm:max-w-xl",
                size === "2xl" && "sm:max-w-2xl",
                size === "3xl" && "sm:max-w-3xl",
                size === "4xl" && "sm:max-w-4xl",
                size === "5xl" && "sm:max-w-5xl",
                size === "6xl" && "sm:max-w-6xl",
                size === "7xl" && "sm:max-w-7xl",
                size === "full" && "sm:max-w-full"
              )}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
