import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

export type ActionResultDto = { success?: ResultMessageDto; error?: ResultMessageDto };
type ResultMessageDto = { title?: string; description: string; closeText?: string };
interface Props {
  actionResult?: ActionResultDto;
  className?: string;
  actionData?: { error?: string; success?: string } | null;
  showSuccess?: boolean;
  showError?: boolean;
  onClosed?: () => void;
}

export default function ActionResultModal({ actionResult, className, actionData, showSuccess = true, showError = true, onClosed }: Props) {
  const [data, setData] = useState<ResultMessageDto>();
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState(actionResult);

  useEffect(() => {
    setStatus(actionResult);
  }, [actionResult]);

  useEffect(() => {
    if (actionData?.error && showError) {
      setStatus({ error: { description: actionData.error } });
    } else if (actionData?.success && showSuccess) {
      setStatus({ success: { description: actionData.success } });
    }
  }, [actionData, showError, showSuccess]);

  useEffect(() => {
    if (status?.success) {
      setData({
        title: status.success.title ?? "Success",
        description: status.success.description,
        closeText: status.success.closeText ?? "Close",
      });
      setOpen(true);
    } else if (status?.error) {
      setData({
        title: status.error.title ?? "Error",
        description: status.error.description,
        closeText: status.error.closeText ?? "Close",
      });
      setOpen(true);
    }
  }, [status]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className={clsx(className, "fixed inset-0 z-10 overflow-y-auto")} onClose={() => setOpen(false)}>
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
            <div className="inline-block w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                {status?.success && (
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                {status?.error && (
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {data?.title ?? ""}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{data?.description ?? ""}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className={clsx(
                    "inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm",
                    status?.success && "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
                    status?.error && "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                  )}
                  onClick={() => {
                    setOpen(false);
                    if (onClosed) {
                      onClosed();
                    }
                  }}
                >
                  {data?.closeText ?? "Close"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
