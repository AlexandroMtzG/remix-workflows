import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import { getTenantIdOrNull } from "~/utils/services/urlService";
import { WorkflowBlockDto } from "~/modules/workflowEngine/dtos/WorkflowBlockDto";
import { WorkflowBlockType } from "~/modules/workflowEngine/dtos/WorkflowBlockTypes";
import { WorkflowConditionsGroupDto } from "~/modules/workflowEngine/dtos/WorkflowConditionDtos";
import UrlUtils from "~/utils/app/UrlUtils";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export namespace WorkflowsIdIndexApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    item: WorkflowDto;
  };
  export let loader = async ({ request, params }: LoaderArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const item = await WorkflowsService.get(params.id!, { tenantId });
    if (!item) {
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    }
    const data: LoaderData = {
      metatags: [{ title: `Build Workflow: ${item.name} | ${process.env.APP_NAME}` }],
      item,
    };
    return json(data);
  };

  export type ActionData = {
    success?: string;
    error?: string;
  };
  export const action = async ({ request, params }: ActionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString();
    const item = await WorkflowsService.get(params.id!, { tenantId });
    if (!item) {
      return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    }
    if (action === "save") {
      try {
        const workflow = JSON.parse(form.get("workflow")?.toString() ?? "{}") as WorkflowDto;
        const redirectTo = form.get("redirectTo")?.toString();
        await WorkflowsService.update(params.id!, workflow, { tenantId });
        if (redirectTo) {
          return redirect(redirectTo);
        }
        return json({ success: "Workflow saved: " + workflow.name });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "update-block") {
      const id = form.get("id")?.toString();
      const block = item.blocks.find((x) => x.id === id);
      if (!block) {
        return json({ error: "Block not found" }, { status: 404 });
      }
      try {
        const blockData = JSON.parse(form.get("block")?.toString() ?? "{}") as WorkflowBlockDto;
        const redirectTo = form.get("redirectTo")?.toString();
        await WorkflowsService.updateBlock(block.id, blockData);
        if (redirectTo) {
          return redirect(redirectTo);
        }
        return json({ success: "Block updated: " + blockData.type });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "add-block") {
      const fromBlockId = form.get("fromBlockId")?.toString() ?? "";
      const condition = form.get("condition")?.toString() ?? "";
      const type = form.get("type")?.toString() as WorkflowBlockType;
      if (fromBlockId) {
        const fromBlock = item.blocks.find((x) => x.id === fromBlockId);
        if (!fromBlock) {
          return json({ error: "From block not found" }, { status: 404 });
        }
      }
      try {
        const newBlock = await WorkflowsService.addBlock({
          workflow: item,
          fromBlockId,
          type,
          condition,
        });
        return json({
          success: "Block added",
          newBlockId: newBlock.id,
        });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "delete-block") {
      const id = form.get("id")?.toString() ?? "";
      const block = item.blocks.find((x) => x.id === id);
      if (!block) {
        return json({ error: "Block not found" }, { status: 404 });
      }
      try {
        await WorkflowsService.deleteBlock(block.id);
        return json({ success: "Block deleted" });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "delete-connection") {
      const id = form.get("id")?.toString() ?? "";
      const fromBlockId = form.get("fromBlockId")?.toString() ?? "";
      const toBlockId = form.get("toBlockId")?.toString() ?? "";
      try {
        if (fromBlockId && toBlockId) {
          const fromBlock = item.blocks.find((x) => x.id === fromBlockId);
          const toBlock = item.blocks.find((x) => x.id === toBlockId);
          if (!fromBlock || !toBlock) {
            return json({ error: "Blocks not found" }, { status: 404 });
          }
          await WorkflowsService.deleteConnection({ fromBlockId, toBlockId });
        } else {
          await WorkflowsService.deleteConnection({ id });
        }
        return json({ success: "Connection deleted" });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "connect-blocks") {
      const fromBlockId = form.get("fromBlockId")?.toString() ?? "";
      const toBlockId = form.get("toBlockId")?.toString() ?? "";
      const fromBlock = item.blocks.find((x) => x.id === fromBlockId);
      const toBlock = item.blocks.find((x) => x.id === toBlockId);
      const condition = form.get("condition")?.toString() ?? "";
      if (!fromBlock || !toBlock) {
        return json({ error: "Blocks not found" }, { status: 404 });
      }
      try {
        await WorkflowsService.connectBlocks({ fromBlockId, toBlockId, condition });
        return json({ success: "Blocks connected" });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "update-conditions-groups") {
      const blockId = form.get("blockId")?.toString() ?? "";
      const block = item.blocks.find((x) => x.id === blockId);
      if (!block) {
        return json({ error: "Block not found" }, { status: 404 });
      }
      const conditionsGroups = JSON.parse(form.get("conditionsGroups")?.toString() ?? "[]") as WorkflowConditionsGroupDto[];
      try {
        await WorkflowsService.updateConditionsGroups(block, conditionsGroups);
        return json({ success: "Conditions groups updated" });
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "create-input-example") {
      const title = form.get("title")?.toString() ?? "";
      const input = form.get("input")?.toString() ?? "";
      await WorkflowsService.createInputExample({
        workflowId: item.id,
        title,
        input,
      });
      return json({ success: "Input example created" });
    } else if (action === "update-input-example") {
      const id = form.get("id")?.toString() ?? "";
      const title = form.get("title")?.toString() ?? "";
      const input = form.get("input")?.toString() ?? "";
      const inputExample = item.inputExamples.find((x) => x.id === id);
      if (!inputExample) {
        return json({ error: "Input example not found" }, { status: 404 });
      }
      await WorkflowsService.updateInputExample(inputExample.id!, {
        title,
        input,
      });
      return json({ success: "Input example updated" });
    } else if (action === "delete-input-example") {
      const id = form.get("id")?.toString() ?? "";
      const inputExample = item.inputExamples.find((x) => x.id === id);
      if (!inputExample) {
        return json({ error: "Input example not found" }, { status: 404 });
      }
      await WorkflowsService.deleteInputExample(inputExample.id!);
      return json({ success: "Input example deleted" });
    } else if (action === "delete") {
      try {
        await WorkflowsService.del(item.id, { tenantId });
        return redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
      } catch (e: any) {
        return json({ error: e.message }, { status: 400 });
      }
    } else if (action === "toggle") {
      const enabled = form.get("enabled")?.toString() === "true";

      if (enabled && item.status === "draft") {
        await WorkflowsService.update(item.id, { status: "live" }, { tenantId });
        return json({ success: "Workflow is now live" });
      } else if (!enabled && item.status === "live") {
        await WorkflowsService.update(
          item.id,
          {
            status: "draft",
          },
          { tenantId }
        );
        return json({ success: "Workflow is now a draft" });
      }
    }
    return json({ error: "Invalid action" }, { status: 400 });
  };
}
