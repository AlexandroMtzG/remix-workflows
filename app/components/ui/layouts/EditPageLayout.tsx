import { ReactNode } from "react";
import { useParams } from "@remix-run/react";
import BreadcrumbSimple from "../breadcrumbs/BreadcrumbSimple";
import Tabs, { TabItem } from "../tabs/Tabs";

interface Props {
  title?: ReactNode;
  menu?: {
    title: string;
    routePath?: string;
  }[];
  buttons?: ReactNode;
  children: ReactNode;
  withHome?: boolean;
  tabs?: TabItem[];
}
export default function EditPageLayout({ title, menu, buttons, children, withHome = true, tabs }: Props) {
  const params = useParams();
  const home = params.tenant ? `/app/${params.tenant}/dashboard` : "/admin/dashboard";
  return (
    <div className="mx-auto max-w-5xl space-y-3 px-4 pb-6 pt-3 sm:px-6 lg:px-8 xl:max-w-7xl 2xl:max-w-screen-2xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <h1 className="flex flex-1 items-center truncate text-xl font-medium">{title}</h1>
          <div className="flex items-center space-x-2">{buttons}</div>
        </div>

        {menu && <BreadcrumbSimple home={withHome ? home : undefined} menu={menu} />}

        {tabs && <Tabs tabs={tabs} className="flex-grow" />}
      </div>

      {children}
    </div>
  );
}
