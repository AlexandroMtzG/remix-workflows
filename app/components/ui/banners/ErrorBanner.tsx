import { ReactNode } from "react";
import { Link } from "@remix-run/react";

interface Props {
  title: ReactNode;
  text?: ReactNode | string;
  redirect?: string;
  children?: ReactNode;
}

export default function ErrorBanner({ title = "Error", text = "", redirect, children }: Props) {
  return (
    <div className="not-prose rounded-md border border-red-400 bg-red-50">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="ml-3">
            <h3 className="text-sm font-medium leading-5 text-red-800">{title}</h3>
            <div className="mt-2 text-sm leading-5 text-red-700">
              <div>
                {text}{" "}
                {redirect && (
                  <Link className="mt-2 text-theme-800 underline" to={redirect}>
                    Go to {redirect}
                  </Link>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
