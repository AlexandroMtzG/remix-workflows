import { Link, useNavigation, useParams, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import TenantBadge from "~/components/core/tenants/TenantBadge";
import DateCell from "~/components/ui/dates/DateCell";
import InputFilters from "~/components/ui/input/InputFilters";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TableSimple from "~/components/ui/tables/TableSimple";
import WorkflowResultBadge from "~/modules/workflowEngine/components/executions/WorkflowResultBadge";
import { WorkflowExecutionWithDetails } from "~/modules/workflowEngine/db/workflowExecutions.db.server";
import UrlUtils from "~/utils/app/UrlUtils";
import DateUtils from "~/utils/shared/DateUtils";
import { WorkflowsExecutionsApi } from "./executions.api.server";

export default function WorkflowsExecutionsView() {
  const data = useTypedLoaderData<WorkflowsExecutionsApi.LoaderData>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const params = useParams();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function onDelete(item: WorkflowExecutionWithDetails) {
    confirmDelete.current?.setValue(item);
    confirmDelete.current?.show("Delete execution?", "Delete", "Cancel", `Are you sure you want to delete this execution?`);
  }
  function onDeleteConfirm(item: WorkflowExecutionWithDetails) {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }
  return (
    <EditPageLayout
      title={`Workflow Executions`}
      withHome={false}
      buttons={
        <>
          <InputFilters filters={data.filterableProperties} />
        </>
      }
    >
      <TableSimple
        items={data.items}
        actions={[
          {
            title: "Delete",
            onClick: (_idx, i) => (onDelete ? onDelete(i) : undefined),
            destructive: true,
            disabled: (i) => navigation.state === "submitting" && navigation.formData.get("id") === i.id,
          },
          {
            title: "Details",
            onClickRoute: (_idx, i) => UrlUtils.getModulePath(params, `workflow-engine/workflows/${i.workflowId}/executions?executionId=${i.id}`),
            firstColumn: true,
          },
        ]}
        headers={[
          {
            name: "type",
            title: "Type",
            value: (i) => <div>{i.type}</div>,
          },
          {
            name: "status",
            title: "Status",
            value: (i) => (
              <div className="flex max-w-xs flex-col truncate">
                <WorkflowResultBadge createdAt={i.createdAt} startedAt={i.createdAt} completedAt={i.endedAt} status={i.status} error={i.error} />
              </div>
            ),
          },
          {
            name: "tenant",
            title: "Account",
            value: (i) => (i.tenant ? <TenantBadge item={i.tenant} /> : <span className="italic text-gray-600">Admin</span>),
          },
          {
            name: "duration",
            title: "Duration",
            value: (i) => DateUtils.getDurationInSeconds({ start: i.createdAt, end: i.endedAt }),
          },
          {
            name: "blockRuns",
            title: "Block runs",
            value: (i) => <div>{i.blockRuns.length === 1 ? <span>1 block run</span> : <span>{i.blockRuns.length} block runs</span>}</div>,
          },
          {
            name: "createdAt",
            title: "Created at",
            value: (i) => <DateCell date={i.createdAt} />,
          },
          {
            name: "endedAt",
            title: "Ended at",
            value: (i) => <DateCell date={i.endedAt} />,
          },
          {
            name: "workflow",
            title: "Workflow",
            value: (i) => (
              <Link className="truncate font-medium hover:underline" to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${i.workflow.id}`)}>
                {i.workflow.name}
              </Link>
            ),
          },
        ]}
      />
      <ConfirmModal ref={confirmDelete} onYes={onDeleteConfirm} destructive />
    </EditPageLayout>
  );
}
