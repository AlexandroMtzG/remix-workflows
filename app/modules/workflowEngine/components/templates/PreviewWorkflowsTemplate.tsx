import TableSimple from "~/components/ui/tables/TableSimple";
import { WorkflowsTemplateDto } from "../../dtos/WorkflowsTemplateDto";

export default function PreviewWorkflowsTemplate({ template }: { template: WorkflowsTemplateDto }) {
  return (
    <div>
      {template.workflows.map((workflow) => {
        return (
          <div key={workflow.name} className="space-y-2">
            <h3 className="font-medium">{workflow.name}</h3>
            <TableSimple
              items={workflow.blocks}
              headers={[
                {
                  name: "block",
                  title: "Block Type",
                  value: (i) => (
                    <div className="flex-col">
                      <div>{i.type}</div>
                      <div className="text-xs text-gray-500">{i.description || "No description"}</div>
                    </div>
                  ),
                },
                {
                  name: "input",
                  title: "Input",
                  value: (i) =>
                    JSON.stringify({
                      input: i.input,
                    }),
                },
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}
