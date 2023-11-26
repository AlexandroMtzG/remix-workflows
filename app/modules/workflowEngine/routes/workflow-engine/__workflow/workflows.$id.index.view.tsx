import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Link, useParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import reactFlowStyles from "reactflow/dist/style.css";
import { useTypedActionData, useTypedLoaderData } from "remix-typedjson";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import WorkflowBuilder from "~/modules/workflowEngine/components/workflows/WorkflowBuilder";
import WorkflowEditorSidebar from "~/modules/workflowEngine/components/workflows/WorkflowEditorSidebar";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";
import { WorkflowBlockType } from "~/modules/workflowEngine/dtos/WorkflowBlockTypes";
import { WorkflowConditionsGroupDto } from "~/modules/workflowEngine/dtos/WorkflowConditionDtos";
import UrlUtils from "~/utils/app/UrlUtils";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import { WorkflowsIdIndexApi } from "./workflows.$id.index.api.server";

export default function WorkflowsIdIndexView() {
  const data = useTypedLoaderData<WorkflowsIdIndexApi.LoaderData>();
  const actionData = useTypedActionData<WorkflowsIdIndexApi.ActionData>();
  const params = useParams();
  const submit = useSubmit();

  const [workflow, setWorkflow] = useState<WorkflowDto>(data.item);
  const [selectedBlock, setSelectedBlock] = useState<WorkflowBlockDto | null>(null);
  const [addingNextBlockFrom, setAddingNextBlockFrom] = useState<{ fromBlock: WorkflowBlockDto; condition: string | null } | null>(null);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  useEffect(() => {
    setWorkflow(data.item);
    if (selectedBlock) {
      setSelectedBlock(data.item.blocks.find((x) => x.id === selectedBlock.id) ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.item]);

  useEffect(() => {
    if (selectedBlock === null && addingNextBlockFrom !== null) {
      setAddingNextBlockFrom(null);
    }
  }, [addingNextBlockFrom, selectedBlock]);

  function onSave(workflow: WorkflowDto) {
    const form = new FormData();
    form.append("action", "save");
    form.append("workflow", JSON.stringify(workflow));
    submit(form, {
      method: "post",
    });
  }

  function onSaveBlock(block: WorkflowBlockDto) {
    const form = new FormData();
    form.set("action", "update-block");
    form.set("id", block.id);
    form.append("block", JSON.stringify(block));
    submit(form, {
      method: "post",
    });
  }

  function onAddBlock({ type, from, condition }: { type: WorkflowBlockType; from: WorkflowBlockDto | undefined; condition: string | null }) {
    const form = new FormData();
    form.set("action", "add-block");
    form.set("type", type);
    if (condition) {
      form.set("condition", condition);
    }
    if (from) {
      form.set("fromBlockId", from.id);
    }
    submit(form, {
      method: "post",
    });
  }

  function onConnectBlocks(params: { fromBlockId: string; toBlockId: string; condition: string | null }) {
    const form = new FormData();
    form.set("action", "connect-blocks");
    form.set("fromBlockId", params.fromBlockId);
    form.set("toBlockId", params.toBlockId);
    if (params.condition) {
      form.set("condition", params.condition);
    }

    submit(form, {
      method: "post",
    });
  }

  function onDeleteBlock(id: string) {
    const form = new FormData();
    form.set("action", "delete-block");
    form.set("id", id);
    submit(form, {
      method: "post",
    });
  }

  function onDeleteConnection(params: { fromBlockId: string; toBlockId: string } | { id: string }) {
    const form = new FormData();
    form.set("action", "delete-connection");
    if ("id" in params) {
      form.set("id", params.id);
    } else {
      form.set("fromBlockId", params.fromBlockId);
      form.set("toBlockId", params.toBlockId);
    }
    submit(form, {
      method: "post",
    });
  }

  function onUpdateConditionsGroups(blockId: string, conditionsGroups: WorkflowConditionsGroupDto[]) {
    const form = new FormData();
    form.set("action", "update-conditions-groups");
    form.set("blockId", blockId);
    form.set("conditionsGroups", JSON.stringify(conditionsGroups));
    submit(form, {
      method: "post",
    });
  }

  function onToggle(enabled: boolean) {
    const form = new FormData();
    form.set("action", "toggle");
    form.set("enabled", enabled ? "true" : "false");
    submit(form, {
      method: "post",
    });
  }

  return (
    <div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <BreadcrumbSimple menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: workflow.name }]} />
      </div>
      <div className="w-full border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <InputCheckbox
              disabled={workflow.readOnly || (!WorkflowUtils.isReady(workflow) && workflow.status !== "live")}
              asToggle
              value={workflow.status === "live"}
              setValue={(checked) => onToggle(Boolean(checked))}
            />
            <SimpleBadge title={WorkflowUtils.getStatusTitle(workflow)} color={WorkflowUtils.getStatusColor(workflow)} />
          </div>
          <div className="flex items-center space-x-2">
            {/* {WorkflowUtils.canRunManually(workflow) && (
              <button
                type="button"
                className={clsx(
                  "rounded px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300",
                  WorkflowUtils.isReady(workflow) ? "bg-white hover:bg-gray-50" : "bg-gray-100 cursor-not-allowed"
                )}
                disabled={!WorkflowUtils.isReady(workflow)}
              >
                Run manually
              </button>
            )} */}
            <Link
              to={`executions`}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              View all executions
            </Link>
            <WorkflowRunDropdown workflow={workflow} />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        <div className="flex-1">
          <WorkflowBuilder
            workflow={workflow}
            selectedBlock={selectedBlock}
            workflowExecution={null}
            onSelectedBlock={setSelectedBlock}
            onConnectBlocks={onConnectBlocks}
            onDeleteConnection={(id) => onDeleteConnection({ id })}
            onDeleteBlock={onDeleteBlock}
          />
        </div>
        <div className="w-96 overflow-y-auto border-l border-gray-200 bg-white">
          <WorkflowEditorSidebar
            workflow={workflow}
            onSave={onSave}
            selectedBlock={selectedBlock}
            addingNextBlockFrom={addingNextBlockFrom}
            onSelectedBlock={(block) => {
              setSelectedBlock(block);
            }}
            onSaveBlock={onSaveBlock}
            onSetTrigger={(type) => {
              onAddBlock({ type: type, from: undefined, condition: null });
              setAddingNextBlockFrom(null);
            }}
            onAddBlock={({ from, type, condition }) => {
              onAddBlock({ type: type, from: from, condition });
              setAddingNextBlockFrom(null);
            }}
            onAddingNextBlock={(data) => {
              setAddingNextBlockFrom(data);
            }}
            onDeleteBlock={onDeleteBlock}
            onDeleteConnection={onDeleteConnection}
            onUpdateConditionsGroups={onUpdateConditionsGroups}
          />
        </div>
      </div>
    </div>
  );
}
