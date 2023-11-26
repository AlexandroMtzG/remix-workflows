import { WorkflowConditionOperators, WorkflowConditionsDto } from "../dtos/WorkflowConditionDtos";

function getConditionErrors(condition: WorkflowConditionsDto) {
  const errors: string[] = [];
  const operator = WorkflowConditionOperators.find((f) => f.value === condition.operator);
  if (!operator) {
    errors.push("Invalid operator: " + condition.operator);
  }
  if (!condition.variable) {
    errors.push("Variable is required");
  }
  if (!condition.operator) {
    errors.push("Operator is required");
  }
  if (operator?.requiresValue && !condition.value) {
    errors.push("Value is required");
  }
  return errors;
}

function getConditionsErrors(conditions: WorkflowConditionsDto[]) {
  const errors: {
    condition: WorkflowConditionsDto;
    errors: string[];
  }[] = [];
  conditions.forEach((condition) => {
    const conditionErrors = getConditionErrors(condition);
    if (conditionErrors.length > 0) {
      errors.push({
        condition,
        errors: conditionErrors,
      });
    }
  });
  return errors;
}

function getOperator(operatorValue: string) {
  const operator = WorkflowConditionOperators.find((f) => f.value === operatorValue);
  return operator;
}

function getConditionString(condition: WorkflowConditionsDto) {
  const operator = getOperator(condition.operator);
  if (!operator) {
    return "Unknown operator: " + condition.operator;
  }
  if (operator.requiresValue) {
    return `${condition.variable} ${operator.name} ${condition.value}`;
  }
  return `${condition.variable} ${operator.name}`;
}

export default {
  getConditionErrors,
  getConditionsErrors,
  getOperator,
  getConditionString,
};
