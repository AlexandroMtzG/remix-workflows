import WorkflowsTemplatesService from "~/modules/workflowEngine/services/WorkflowsTemplatesService";
import DefaultWorkflowTemplates from "~/modules/workflowEngine/utils/DefaultWorkflowTemplates";

async function seed() {
  for (let index = 0; index < DefaultWorkflowTemplates.length; index++) {
    await WorkflowsTemplatesService.importWorkflows(DefaultWorkflowTemplates[index], {
      tenantId: null,
    });
  }
}

seed();
