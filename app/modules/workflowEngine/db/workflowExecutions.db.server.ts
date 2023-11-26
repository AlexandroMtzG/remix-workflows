import { Prisma, WorkflowBlockExecution, WorkflowExecution } from "@prisma/client";
import { FiltersDto } from "~/application/dtos/data/FiltersDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { db } from "~/utils/db.server";
import { WorkflowStatus } from "../dtos/WorkflowStatus";
import { validateIsReadOnly } from "../utils/WorkflowUtils";

export type WorkflowExecutionWithDetails = WorkflowExecution & {
  workflow: { id: string; name: string };
  tenant: { id: string; name: string; slug: string } | null;
  blockRuns: (WorkflowBlockExecution & {
    workflowBlock: {
      type: string;
      description: string;
    };
  })[];
};

export async function getAllWorkflowExecutions({
  tenantId,
  pagination,
  filters,
}: {
  tenantId: string | null;
  pagination: { page: number; pageSize: number };
  filters: FiltersDto;
}): Promise<{ items: WorkflowExecutionWithDetails[]; pagination: PaginationDto }> {
  let where: Prisma.WorkflowExecutionWhereInput = {
    tenantId,
  };
  const workflowId = filters?.properties.find((f) => f.name === "workflowId")?.value ?? filters?.query ?? "";
  const status = filters?.properties.find((f) => f.name === "status")?.value ?? filters?.query ?? "";
  const type = filters?.properties.find((f) => f.name === "workflowId")?.value ?? filters?.query ?? "";
  if (workflowId) {
    where.workflowId = workflowId;
  }
  if (status) {
    where.status = status;
  }
  if (type) {
    where.type = type;
  }
  const items = await db.workflowExecution.findMany({
    take: pagination.pageSize,
    skip: pagination.pageSize * (pagination.page - 1),
    where,
    include: {
      workflow: { select: { id: true, name: true } },
      tenant: { select: { id: true, name: true, slug: true } },
      blockRuns: {
        orderBy: { startedAt: "asc" },
        include: {
          workflowBlock: {
            select: { type: true, description: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const totalItems = await db.workflowExecution.count({
    where,
  });
  return {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
    },
  };
}

export async function getWorkflowExecutions(
  { workflowId }: { workflowId: string },
  session: { tenantId: string | null }
): Promise<WorkflowExecutionWithDetails[]> {
  return db.workflowExecution.findMany({
    where: {
      workflowId,
      tenantId: session.tenantId,
    },
    include: {
      workflow: { select: { id: true, name: true } },
      tenant: { select: { id: true, name: true, slug: true } },
      blockRuns: {
        orderBy: { startedAt: "asc" },
        include: {
          workflowBlock: {
            select: { type: true, description: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWorkflowExecution(id: string, session: { tenantId: string | null }): Promise<WorkflowExecutionWithDetails | null> {
  return db.workflowExecution
    .findFirstOrThrow({
      where: {
        id,
        tenantId: session.tenantId,
      },
      include: {
        workflow: { select: { id: true, name: true } },
        tenant: { select: { id: true, name: true, slug: true } },
        blockRuns: {
          orderBy: { startedAt: "asc" },
          include: {
            workflowBlock: {
              select: { type: true, description: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => null);
}

export async function updateWorkflowExecution(
  id: string,
  {
    error,
    status,
    output,
    duration,
  }: {
    error: string | null;
    status: WorkflowStatus;
    output: string;
    duration: number;
  }
): Promise<WorkflowExecutionWithDetails> {
  return await db.workflowExecution.update({
    where: { id },
    data: {
      status: error ? "error" : status,
      output,
      duration: Math.round(duration),
      endedAt: new Date(),
      error,
    },
    include: {
      workflow: { select: { id: true, name: true } },
      tenant: { select: { id: true, name: true, slug: true } },
      blockRuns: {
        orderBy: { startedAt: "asc" },
        include: {
          workflowBlock: {
            select: { type: true, description: true },
          },
        },
      },
    },
  });
}

export async function deleteWorkflowExecution(id: string) {
  validateIsReadOnly()
  return await db.workflowExecution.delete({
    where: {
      id,
    },
  });
}
