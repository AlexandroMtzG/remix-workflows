import { Link, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Fragment } from "react";

export type TabWithIcon = {
  name?: string;
  href?: string;
  current: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
};
interface Props {
  tabs: TabWithIcon[];
  className?: string;
  justify?: "start" | "center" | "end" | "between";
}
export default function TabsWithIcons({ tabs, className, justify }: Props) {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <div className={clsx(tabs.length <= 5 && "sm:hidden")}>
        <label htmlFor="tabs" className="sr-only">
          Select
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500"
          value={tabs.find((tab) => tab.current)?.name}
          onChange={(e) => {
            const tab = tabs.find((tab) => tab.name === e.target.value);
            if (tab?.href) {
              navigate(tab.href);
            } else if (tab?.onClick) {
              tab.onClick();
            }
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className={clsx(tabs.length <= 5 ? "hidden sm:block" : "hidden")}>
        <div className="border-b border-gray-200">
          <nav
            className={clsx(
              "-mb-px flex space-x-4",
              justify === "start" && "justify-start",
              justify === "center" && "justify-center",
              justify === "end" && "justify-end",
              justify === "between" && "justify-between"
            )}
            aria-label="Tabs"
          >
            {tabs.map((tab, idx) => (
              <Fragment key={idx}>
                {tab.href && (
                  <Link
                    key={tab.name}
                    to={tab.href}
                    className={clsx(
                      tab.current ? "border-accent-500 text-accent-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "group inline-flex items-center space-x-2 border-b-2 py-2 px-1 text-sm font-medium",
                      tab.className
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.icon}
                    <div className="truncate">{tab.name}</div>
                  </Link>
                )}
                {tab.onClick && (
                  <button
                    type="button"
                    onClick={tab.onClick}
                    className={clsx(
                      tab.current ? "border-accent-500 text-accent-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "group inline-flex w-full items-center space-x-2 border-b-2 py-2 px-1 text-sm font-medium",
                      tab.className
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.icon}
                    <div className="truncate">{tab.name}</div>
                  </button>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
