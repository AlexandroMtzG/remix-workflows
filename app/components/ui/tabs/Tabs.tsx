import { Link, useLocation, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import UrlUtils from "~/utils/app/UrlUtils";

export interface TabItem {
  name: any;
  routePath?: string;
}

interface Props {
  className?: string;
  tabs: TabItem[];
  asLinks?: boolean;
  onSelected?: (idx: number) => void;
  breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  exact?: boolean;
  selectedTab?: number;
}

export default function Tabs({ className = "", breakpoint = "md", tabs = [], asLinks = true, onSelected, exact, selectedTab = 0 }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(selectedTab);

  useEffect(() => {
    if (selectedTab !== selected) {
      setSelected(selectedTab);
    }
  }, [selected, selectedTab]);

  useEffect(() => {
    if (asLinks) {
      let index = 0;
      tabs.forEach((tab, idx) => {
        if (exact) {
          if (tab.routePath && UrlUtils.stripTrailingSlash(location.pathname) === UrlUtils.stripTrailingSlash(tab.routePath)) {
            index = idx;
          }
        } else {
          if (tab.routePath && (location.pathname + location.search).includes(tab.routePath)) {
            index = idx;
          }
        }
      });
      setSelected(index);
    }
  }, [location.pathname, location.search, tabs, asLinks, exact]);

  function selectTab(idx: number) {
    const tab = tabs[idx];
    setSelected(idx);
    if (asLinks) {
      if (tab?.routePath) {
        navigate(tab.routePath);
      }
    } else {
      if (onSelected) {
        onSelected(idx);
      }
    }
  }
  return (
    <div className={className}>
      <div
        className={clsx(
          breakpoint === "sm" && "sm:hidden",
          breakpoint === "md" && "md:hidden",
          breakpoint === "lg" && "lg:hidden",
          breakpoint === "xl" && "xl:hidden",
          breakpoint === "2xl" && "2xl:hidden"
        )}
      >
        <label htmlFor="tabs" className="sr-only">
          Select
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500"
          onChange={(e) => selectTab(Number(e.target.value))}
          value={selected}
        >
          {tabs.map((tab, idx) => {
            return (
              <option key={tab.name} value={Number(idx)}>
                {tab.name}
              </option>
            );
          })}
        </select>
      </div>
      <div
        className={clsx(
          breakpoint === "sm" && "hidden sm:block",
          breakpoint === "md" && "hidden md:block",
          breakpoint === "lg" && "hidden lg:block",
          breakpoint === "xl" && "hidden xl:block",
          breakpoint === "2xl" && "hidden 2xl:block"
        )}
      >
        {(() => {
          if (asLinks) {
            return (
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs
                  .filter((f) => f.routePath)
                  .map((tab, idx) => {
                    return (
                      <Link
                        key={tab.name}
                        to={tab.routePath ?? ""}
                        className={clsx(
                          "truncate border",
                          idx === selected ? "border-accent-300 bg-accent-100 text-accent-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                          "rounded-sm border-transparent px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={idx === selected ? "page" : undefined}
                      >
                        {tab.name}
                      </Link>
                    );
                  })}
              </nav>
            );
          } else {
            return (
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab, idx) => {
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => selectTab(idx)}
                      className={clsx(
                        "truncate",
                        idx === selected ? "border border-accent-300 bg-accent-100 text-accent-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                        "rounded-sm border-transparent px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            );
          }
        })()}
      </div>
    </div>
  );
}
