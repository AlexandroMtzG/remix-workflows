import { redirect } from "@remix-run/node";
import { db } from "../db.server";
import { Params } from "react-router";
import UrlUtils from "../app/UrlUtils";

export async function getTenantIdFromUrl(params: Params) {
  const { tenant } = params;
  let tenantId = "";
  const tenantFromParams = await getTenantByIrOrSlug(tenant);
  if (tenantFromParams) {
    tenantId = tenantFromParams;
    if (!tenantId) {
      // eslint-disable-next-line no-console
      console.log("[urlService] Redirecting to /app");
      throw redirect("/app");
    }
  }
  return tenantId;
}

export async function getTenantIdOrNull({ request, params }: { request: Request; params: Params }) {
  const { tenant } = params;
  const currentPath = new URL(request.url).pathname;
  if (currentPath.startsWith("/admin")) {
    return null;
  } else if (currentPath.startsWith("/app") && UrlUtils.stripTrailingSlash(currentPath) !== "/app") {
    if (!tenant) {
      // eslint-disable-next-line no-console
      console.log("[urlService] getTenantIdOrNull(): Redirecting to /app");
      throw redirect("/app");
    }
    const tenantFromParams = await getTenantByIrOrSlug(tenant);
    if (!tenantFromParams) {
      // eslint-disable-next-line no-console
      console.log("[urlService] getTenantIdOrNull(): Redirecting to /app");
      throw redirect("/app");
    }
    return tenantFromParams;
  }
  return null;
}

export async function getTenantByIrOrSlug(tenant: string | undefined) {
  return (
    (
      await db.tenant.findFirst({
        where: { OR: [{ slug: tenant }, { id: tenant }] },
        select: { id: true },
      })
    )?.id ?? ""
  );
}

export type TenantOrAdminConfig = { isAdmin: true } | { tenantId: string };
export async function getTenantOrAdminConfig({ request, params }: { request: Request; params: Params }): Promise<{ isAdmin: true } | { tenantId: string }> {
  const tenantIrOrNull = await getTenantIdOrNull({ request, params });
  const config: { isAdmin: true } | { tenantId: string } = tenantIrOrNull === null ? { isAdmin: true } : { tenantId: tenantIrOrNull };
  return config;
}
