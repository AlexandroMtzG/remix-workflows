import { Link, useLoaderData } from "@remix-run/react";
import NumberUtils from "~/utils/shared/NumberUtils";
import { WorkflowEngineIndexApi } from "./index.api.server";

export default function WorkflowEngineIndexView() {
  const data = useLoaderData<WorkflowEngineIndexApi.LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Overview</h3>
      </div>
      <dl className="grid gap-2 sm:grid-cols-3">
        <SummaryCard title="Workflows" value={data.summary.workflowsTotal} to={"/admin/workflow-engine/workflows"} />
        <SummaryCard title="Executions" value={data.summary.executionsTotal} to={"/admin/workflow-engine/executions"} />
        <SummaryCard title="Variables" value={data.summary.variablesTotal} to={"/admin/workflow-engine/variables"} />
      </dl>
    </div>
  );
}

function SummaryCard({ title, value, to }: { title: string; value: number; to: string }) {
  return (
    <Link to={to}>
      <div className="group overflow-hidden rounded-lg border border-transparent bg-white px-4 py-3 shadow hover:border-gray-200">
        <dt className="truncate text-xs font-medium uppercase text-gray-500">
          <div>{title}</div>
        </dt>
        <dd className="mt-1 truncate text-2xl font-semibold text-gray-900">{NumberUtils.intFormat(value)}</dd>
      </div>
    </Link>
  );
}
