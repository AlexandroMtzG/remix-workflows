import { Workflow, WorkflowInputExample } from "@prisma/client";
import { db } from "~/utils/db.server";
import { WorkflowBlockWithDetails } from "./workflowBlocks.db.server";
import { validateIsReadOnly } from "../utils/WorkflowUtils";

export type WorkflowWithDetails = Workflow & {
  blocks: WorkflowBlockWithDetails[];
  inputExamples: WorkflowInputExample[];
  _count: {
    executions: number;
  };
};

export async function getAllWorkflows({
  tenantId,
  status,
}: {
  tenantId: string | null;
  status?: "draft" | "live" | "archived";
}): Promise<WorkflowWithDetails[]> {
  return await db.workflow.findMany({
    where: { tenantId, status },
    include: {
      blocks: {
        include: {
          toBlocks: { include: { toBlock: true } },
          conditionsGroups: { include: { conditions: { orderBy: { index: "asc" } } }, orderBy: { index: "asc" } },
        },
      },
      inputExamples: true,
      _count: { select: { executions: true } },
    },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });
}

export async function getWorkflowsIdsAndNames({ tenantId }: { tenantId: string | null }): Promise<{ id: string; name: string }[]> {
  return await db.workflow.findMany({
    where: { tenantId },
    select: { id: true, name: true },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });
}

export async function getWorkflowById({ id, tenantId }: { id: string; tenantId: string | null }): Promise<WorkflowWithDetails | null> {
  return await db.workflow
    .findFirstOrThrow({
      where: { id, tenantId },
      include: {
        blocks: {
          include: {
            toBlocks: { include: { toBlock: true } },
            conditionsGroups: {
              include: { conditions: { orderBy: { index: "asc" } } },
              orderBy: { index: "asc" },
            },
          },
        },
        inputExamples: true,
        _count: { select: { executions: true } },
      },
    })
    .catch(() => {
      return null;
    });
}

export async function getWorkflowByName({ name, tenantId }: { name: string; tenantId: string | null }): Promise<WorkflowWithDetails | null> {
  return await db.workflow
    .findFirstOrThrow({
      where: { name, tenantId },
      include: {
        blocks: {
          include: {
            toBlocks: { include: { toBlock: true } },
            conditionsGroups: {
              include: { conditions: { orderBy: { index: "asc" } } },
              orderBy: { index: "asc" },
            },
          },
        },
        inputExamples: true,
        _count: { select: { executions: true } },
      },
    })
    .catch(() => {
      return null;
    });
}

export async function createWorkflow(data: { tenantId: string | null; name: string; description: string }) {
  validateIsReadOnly();
  return await db.workflow.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      description: data.description,
    },
  });
}

export async function updateWorkflow(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: "draft" | "live" | "archived";
  }
) {
  validateIsReadOnly();
  return await db.workflow.updateMany({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
}

export async function deleteWorkflow(id: string) {
  validateIsReadOnly();
  return await db.workflow.deleteMany({
    where: { id },
  });
}

export async function countWorkflows({ tenantId }: { tenantId: string | null }) {
  return await db.workflow.count({
    where: { tenantId },
  });
}
