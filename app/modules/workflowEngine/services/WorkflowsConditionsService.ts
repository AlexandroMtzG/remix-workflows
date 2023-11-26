import { WorkflowConditionOperators, WorkflowConditionsGroupDto } from "../dtos/WorkflowConditionDtos";
import { parseVariable } from "./WorkflowsVariablesService";

function validateGroups({ conditionGroup, workflowContext }: { conditionGroup: WorkflowConditionsGroupDto; workflowContext: { [key: string]: any } }) {
  const results = conditionGroup.conditions.map((condition) => {
    const operator = WorkflowConditionOperators.find((f) => f.value === condition.operator);
    if (!operator) {
      throw new Error("Invalid operator: " + condition.operator);
    }
    const variable = parseVariable(condition.variable, workflowContext);
    if (!operator.requiresValue) {
      switch (operator.value) {
        case "isNotEmpty":
          return variable && variable !== "";
        case "isEmpty":
          return !variable || variable.trim() === "";
        default:
          return false;
      }
    } else {
      const value = parseVariable(condition.value, workflowContext);
      switch (operator.value) {
        case "=":
          return (variable?.toString() || "") === (value?.toString() || "");
        case "!=":
          return (variable?.toString() || "") !== (value?.toString() || "");
        case ">":
          return variable && value && variable > value;
        case "<":
          return variable && value && variable < value;
        case ">=":
          return variable && value && variable >= value;
        case "<=":
          return variable && value && variable <= value;
        case "startsWith":
          return variable?.startsWith(value || "");
        case "contains":
          return variable?.includes(value || "");
        case "doesNotContain":
          return !variable?.includes(value || "");
        default:
          throw new Error("Invalid operator: " + operator.value);
      }
    }
  });
  const groupResult = conditionGroup.type === "AND" ? results.every((f) => f) : results.some((f) => f);
  return groupResult;
}

export default {
  validateGroups,
};
