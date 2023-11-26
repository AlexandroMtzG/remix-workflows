// import type { SvgIcon } from "../enums/shared/SvgIcon";
import type { ReactNode } from "react";
// import { DefaultPermission } from "../dtos/shared/DefaultPermissions";

export interface SideBarItem {
  title: string;
  path: string;
  icon?: string;
  description?: string;
  open?: boolean;
  adminOnly?: boolean;
  // tenantUserTypes?: TenantUserType[];
  // permission?: DefaultPermission;
  items?: SideBarItem[];
  side?: ReactNode;
  exact?: boolean;
  featureFlag?: string;
  redirectTo?: string;
  isCollapsible?: boolean;
}
