import type { MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import LinkOrAhref from "./LinkOrAhref";

interface Props {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  to?: string;
  target?: undefined | "_blank";
  disabled?: boolean;
  destructive?: boolean;
  isExternal?: boolean;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ButtonPrimary({ className = "", type = "button", onClick, disabled, destructive, to, target, isExternal = false, children }: Props) {
  const combinedClassName = clsx(
    className,
    "inline-flex items-center space-x-2 px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-300",
    disabled && "cursor-not-allowed opacity-75",
    !destructive && "bg-gray-800",
    destructive && "bg-red-600",
    !disabled && !destructive && !className && "hover:bg-gray-900 focus:ring-gray-500 hover:text-gray-100",
    !disabled && destructive && "hover:bg-red-700 focus:ring-red-500"
  );

  return (
    <span>
      {(() => {
        if (!to || disabled) {
          return (
            <button
              onClick={onClick}
              type={type}
              disabled={disabled}
              className={clsx(
                className,
                "inline-flex items-center space-x-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300",
                disabled && "cursor-not-allowed opacity-75",
                !destructive && "bg-gray-800",
                destructive && "bg-red-600",
                !disabled && !destructive && !className && "hover:bg-gray-900 hover:text-gray-100 focus:ring-gray-500",
                !disabled && destructive && "hover:bg-red-700 focus:ring-red-500"
              )}
            >
              {children}
            </button>
          );
        } else if (to && isExternal) {
          return (
            <a href={to} className={combinedClassName} target={target}>
              {children}
            </a>
          );
        } else {
          return (
            <LinkOrAhref
              to={disabled ? "" : to}
              target={target}
              className={clsx(
                className,
                "borde1-transparent inline-flex items-center space-x-2 rounded-md border px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300",
                disabled && "cursor-not-allowed opacity-75",
                !destructive && "bg-gray-800",
                destructive && "bg-red-600",
                !disabled && !destructive && !className && "hover:bg-gray-900 hover:text-gray-100 focus:ring-gray-500",
                !disabled && destructive && "hover:bg-red-700 focus:ring-red-500"
              )}
            >
              {children}
            </LinkOrAhref>
          );
        }
      })()}
    </span>
  );
}
