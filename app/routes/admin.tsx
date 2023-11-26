import { Outlet } from "@remix-run/react";
import SidebarLayout from "~/components/layouts/SidebarLayout";

export default function () {
  return (
    <div>
      <SidebarLayout layout="admin">
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
