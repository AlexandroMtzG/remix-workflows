import { json } from "@remix-run/node";
import { useTypedLoaderData } from "remix-typedjson";
import Header from "~/components/Header";
import ServerError from "~/components/ServerError";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import { WorkflowWithDetails, getAllWorkflows } from "~/modules/workflowEngine/db/workflows.db.server";

type LoaderData = {
  workflows: WorkflowWithDetails[];
};
export let loader = async () => {
  const data: LoaderData = {
    workflows: await getAllWorkflows({ tenantId: null }),
  };
  return json(data);
};

export default function Index() {
  const data = useTypedLoaderData<LoaderData>();
  return (
    <div>
      <Header />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center space-y-8 px-8 py-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Remix Workflows</h1>
        <p className="text-center text-2xl text-gray-800">Build simple but flexible workflows for your SaaS.</p>
        <div className="mt-10 flex w-full max-w-md items-center justify-center gap-x-6">
          <ButtonPrimary to="/admin/workflow-engine">Get Started ({data.workflows.length} workflows)</ButtonPrimary>
        </div>
        <div className="max-w-lg mx-auto w-full h-64">
          <iframe
                key="demo"
                src="https://www.loom.com/embed/bdab996c089f471ab508a97ba2d506e2"
                title="Remix Workflows Demo"
                loading="lazy"
                className="min-h-full w-full object-cover md:h-auto"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
