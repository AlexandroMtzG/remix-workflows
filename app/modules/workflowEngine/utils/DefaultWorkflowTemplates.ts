import { WorkflowsTemplateDto } from "../dtos/WorkflowsTemplateDto";

const templates: WorkflowsTemplateDto[] = [
  {
    title: "Sample HTTP Requests",
    workflows: [
      {
        name: "Get JSONPlaceholder TODO Item",
        description: "Uses HTTP Request, IF, Switch, and Alert User blocks",
        blocks: [
          {
            id: "manualTrigger",
            type: "manual",
            description: "Triggers the workflow",
            input: {
              validation: JSON.stringify(
                {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                  },
                  required: ["id"],
                },
                null,
                2
              ),
            },
          },
          {
            id: "httpRequest",
            type: "httpRequest",
            description: "Fetches a todo item from JSONPlaceholder",
            input: {
              url: "{{$vars.jsonPlaceholderUrl}}/todos/{{$params.id}}",
              method: "GET",
              // body: "",
              // headers: {},
              throwsError: true,
            },
          },
          {
            id: "if",
            type: "if",
            description: "Checks if the request was successful",
            conditionGroups: [
              {
                type: "AND",
                conditions: [
                  {
                    variable: "{{httpRequest.statusCode}}",
                    operator: "=",
                    value: "200",
                  },
                ],
              },
            ],
          },
          {
            id: "logNotFound",
            type: "alertUser",
            description: "Logs not found",
            input: {
              type: "error",
              message: "Error: {{httpRequest.error}}",
            },
          },
          {
            id: "logFound",
            type: "alertUser",
            description: "Logs HTTP Request body",
            input: {
              message: `ID: {{httpRequest.body.id}},
  Title ({{httpRequest.body.title}},
  Completed: {{httpRequest.body.completed}}),
  User ID: {{httpRequest.body.userId}}`,
            },
          },
          {
            id: "alertUser",
            type: "alertUser",
            description: "Alerts user once the workflow is done",
            input: {
              message: `Workflow done!`,
            },
          },
        ],
        toBlocks: [
          { fromBlockId: "manualTrigger", toBlockId: "httpRequest" },
          { fromBlockId: "httpRequest", toBlockId: "if" },
          { fromBlockId: "if", toBlockId: "logNotFound", condition: "false" },
          { fromBlockId: "if", toBlockId: "logFound", condition: "true" },
          { fromBlockId: "logNotFound", toBlockId: "alertUser" },
          { fromBlockId: "logFound", toBlockId: "alertUser" },
        ],
        inputExamples: [
          { title: "Existing item", input: { id: 10 } },
          { title: "Non-existing item", input: { id: -1 } },
          {
            title: "ID parameter not provided",
            input: {},
          },
          {
            title: "ID parameter is not a number",
            input: { id: "abc" },
          },
        ],
      },
    ],
    variables: [{ name: "jsonPlaceholderUrl", value: "https://jsonplaceholder.typicode.com" }],
  },
  {
    title: "Alert User",
    workflows: [
      {
        name: "Alert User",
        description: "Alerts the user",
        blocks: [
          {
            id: "manualTrigger",
            type: "manual",
            description: "Triggers the workflow",
            input: {
              validation: JSON.stringify(
                {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                  required: ["message"],
                },
                null,
                2
              ),
            },
          },
          {
            id: "alertUser",
            type: "alertUser",
            description: "Alerts user once the workflow is done",
            input: {
              message: `{{$params.message}}`,
            },
          },
        ],
        toBlocks: [{ fromBlockId: "manualTrigger", toBlockId: "alertUser" }],
        inputExamples: [
          { title: "Hello world", input: { message: "Hello world!" } },
          { title: "Long message", input: { message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, eu ultricies nisl nisl eget nisl. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, eu ultricies nisl nisl eget nisl." } },
        ],
      },
    ],
    variables: [],
  },
];

export default templates;
