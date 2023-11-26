export type WorkflowConditionsGroupDto = {
  // id: string;
  index: number;
  type: "AND" | "OR";
  conditions: WorkflowConditionsDto[];
};

export type WorkflowConditionsDto = {
  // id: string;
  index: number;
  variable: string; // Refers to the variable in the workflow context
  operator: WorkflowConditionOperator; // '=', '!=', '>', '<', '>=', '<=', etc.
  value: string; // The value to compare against
};

export type WorkflowConditionOperator = (typeof WorkflowConditionOperators)[number]["value"];
export const WorkflowConditionOperators = [
  { name: "Equals", value: "=", requiresValue: true },
  { name: "Not equals", value: "!=", requiresValue: true },
  { name: "Greater than", value: ">", requiresValue: true },
  { name: "Less than", value: "<", requiresValue: true },
  { name: "Greater than or equals", value: ">=", requiresValue: true },
  { name: "Less Than or equals", value: "<=", requiresValue: true },
  { name: "Contains", value: "contains", requiresValue: true },
  { name: "Does not contain", value: "doesNotContain", requiresValue: true },
  { name: "Starts with", value: "startsWith", requiresValue: true },
  { name: "Ends with", value: "endsWith", requiresValue: true },
  { name: "Is empty", value: "isEmpty", requiresValue: false },
  { name: "Is not empty", value: "isNotEmpty", requiresValue: false },
] as const;
