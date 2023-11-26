import { db } from "~/utils/db.server";
import { validateIsReadOnly } from "../utils/WorkflowUtils";

export async function getAllWorkflowVariables({ tenantId }: { tenantId: string | null }) {
  return await db.workflowVariable.findMany({
    where: { tenantId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getWorkflowVariableById(id: string, { tenantId }: { tenantId: string | null }) {
  return await db.workflowVariable
    .findFirstOrThrow({
      where: { id, tenantId },
    })
    .catch(() => {
      return null;
    });
}

export async function getWorkflowVariableByName(name: string, { tenantId }: { tenantId: string | null }) {
  return await db.workflowVariable
    .findFirstOrThrow({
      where: { name, tenantId },
    })
    .catch(() => {
      return null;
    });
}

export async function createWorkflowVariable({ tenantId, name, value }: { tenantId: string | null; name: string; value: string }) {
  validateIsReadOnly();
  return await db.workflowVariable.create({
    data: {
      tenantId,
      name,
      value,
    },
  });
}

export async function updateWorkflowVariable(id: string, { name, value }: { name?: string; value?: string }) {
  validateIsReadOnly();
  return await db.workflowVariable.update({
    where: {
      id,
    },
    data: {
      name,
      value,
    },
  });
}

export async function deleteWorkflowVariable(id: string) {
  validateIsReadOnly();
  return await db.workflowVariable.delete({
    where: {
      id,
    },
  });
}
