import { ReactNode } from "react";
import Breadcrumb from "../breadcrumbs/Breadcrumb";
import Tabs, { TabItem } from "../tabs/Tabs";

interface Props {
  title?: ReactNode;
  buttons?: ReactNode;
  children: ReactNode;
  tabs?: TabItem[];
  breadcrumb?: { title: string; routePath?: string }[];
  replaceTitleWithTabs?: boolean;
}
export default function IndexPageLayout({ title, buttons, children, tabs, breadcrumb, replaceTitleWithTabs }: Props) {
  return (
    <>
      {breadcrumb && <Breadcrumb menu={breadcrumb} />}
      {(title || buttons || (replaceTitleWithTabs && tabs)) && (
        <div className="w-full border-b border-gray-300 bg-white py-2 shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between space-x-2 px-4 sm:px-6 lg:px-8 xl:max-w-full">
            {replaceTitleWithTabs && tabs ? (
              <Tabs tabs={tabs} className="flex-grow" />
            ) : (
              <div className="flex flex-1 items-center truncate font-bold">{title}</div>
            )}
            {buttons && <div className="flex items-center space-x-2">{buttons}</div>}
          </div>
        </div>
      )}
      {tabs && !replaceTitleWithTabs && (
        <div className="w-full py-2">
          <div className="mx-auto flex max-w-5xl items-center justify-between space-x-2 px-4 sm:px-6 lg:px-8 xl:max-w-full">
            <Tabs tabs={tabs} className="flex-grow" />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-5xl space-y-2 px-4 pb-6 pt-2 sm:px-6 lg:px-8 xl:max-w-full">{children}</div>
    </>
  );
}
