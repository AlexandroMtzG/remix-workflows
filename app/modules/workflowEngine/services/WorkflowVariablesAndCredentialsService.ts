import { getAllWorkflowVariables } from "../db/workflowVariable.db.server";

async function getVariablesContext({ tenantId }: { tenantId: string | null }): Promise<{ [key: string]: string }> {
  let variables: { [key: string]: string } = {};

  const items = await getAllWorkflowVariables({ tenantId });
  items.forEach((item) => {
    variables[item.name] = item.value;
  });
  return variables;
}

export default {
  getVariablesContext,
};
