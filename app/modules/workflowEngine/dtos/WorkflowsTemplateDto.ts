import { WorkflowBlockType } from "./WorkflowBlockTypes";
import { WorkflowConditionOperator } from "./WorkflowConditionDtos";

export type WorkflowsTemplateDto = {
  title: string;
  workflows: WorkflowTemplateDto[];
  variables?: { name: string; value: string }[];
};

export type WorkflowTemplateDto = {
  name: string;
  description?: string;
  blocks: {
    id: string;
    type: WorkflowBlockType; // "manual" | "if" | "httpRequest" | "log" | "doNothing"
    description?: string;
    input?: { [key: string]: any };
    conditionGroups?: {
      // index: number;
      type: "AND" | "OR";
      conditions: {
        // index: number;
        variable: string;
        operator: WorkflowConditionOperator; // '=', '!=', '>', '<', '>=', '<=', 'contains', 'doesNotContain', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'
        value: string; // The value to compare against
      }[];
    }[];
  }[];
  toBlocks: {
    fromBlockId: string;
    toBlockId: string;
    condition?: string; // if (true, false)
  }[];
  inputExamples: {
    title: string;
    input: { [key: string]: any };
  }[];
};
