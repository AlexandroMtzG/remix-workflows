import { useMatches } from "@remix-run/react";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { UserSession, createUserSession, generateAnalyticsUserId, getUserInfo, getUserSession } from "../session.server";
import { json } from "@remix-run/node";

export type AppRootData = {
  metatags: MetaTagsDto;
  userSession: UserSession;
  debug: boolean;
};

export function useRootData(): AppRootData {
  return (useMatches().find((f) => f.pathname === "/" || f.pathname === "")?.data ?? {}) as AppRootData;
}

export async function loadRootData({ request }: { request: Request }) {
  const userSession = await getUserSession(request);
  const userInfo = await getUserInfo(request);

  const headers = new Headers();
  if (!userSession.get("userAnalyticsId")) {
    return createUserSession(
      {
        userAnalyticsId: generateAnalyticsUserId(),
        userId: "",
      },
      new URL(request.url).pathname
    );
  }

  const metatags = {
    title: "Remix Workflows",
    description: "Workflow Builder with Remix.run, React Flow, Prisma, and Tailwind CSS.",
    seoImage: "https://yahooder.sirv.com/remix-workflows/cover.png",
  };

  const data: AppRootData = {
    metatags: [
      { charset: "utf-8" },
      { title: metatags.title },
      { name: "description", content: "Manage workflows for your SaaS" },
      { name: "og:title", content: metatags.title },
      { name: "og:description", content: metatags.description },
      { name: "og:image", content: metatags.seoImage },
      { name: "og:url", content: request.url },
      { name: "twitter:title", content: metatags.title },
      { name: "twitter:description", content: metatags.description },
      { name: "twitter:image", content: metatags.seoImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    userSession: userInfo,
    debug: process.env.NODE_ENV === "development",
  };

  return json(data, { headers });
}
