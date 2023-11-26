import { LoaderFunction, json, V2_MetaFunction, LoaderArgs } from "@remix-run/node";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export namespace WorkflowEngineApi {
  type LoaderData = {
    metatags: MetaTagsDto;
  };

  export let loader = async ({ request, params }: LoaderArgs) => {
    const data: LoaderData = {
      metatags: [{ title: `Workflows | ${process.env.APP_NAME}` }],
    };
    return json(data);
  };
}
