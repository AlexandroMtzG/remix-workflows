import { WorkflowConditionsGroupDto } from "./WorkflowConditionDtos";
import { WorkflowBlockType } from "./WorkflowBlockTypes";

export type WorkflowBlockDto = {
  id: string;
  index: number;
  type: WorkflowBlockType;
  variableName: string;
  description: string;
  input: { [key: string]: any };
  isTrigger: boolean;
  isBlock: boolean;
  // position: {
  //   x: number;
  //   y: number;
  // };
  conditionGroups: WorkflowConditionsGroupDto[];
  toBlocks: {
    id: string;
    // flowId: string;
    // sourceHandle?: string | null;
    toBlockId: string;
    condition: string | null;
  }[];
};
