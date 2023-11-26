import { Form, Link, useParams, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTypedActionData } from "remix-typedjson";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputText from "~/components/ui/input/InputText";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { WorkflowsTemplateDto } from "~/modules/workflowEngine/dtos/WorkflowsTemplateDto";
import DefaultWorkflowTemplates from "~/modules/workflowEngine/utils/DefaultWorkflowTemplates";
import UrlUtils from "~/utils/app/UrlUtils";
import { WorkflowsTemplatesApi } from "./templates.api.server";
import InputSearch from "~/components/ui/input/InputSearch";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import WorkflowUtils from "../../helpers/WorkflowUtils";
import EmptyState from "~/components/ui/emptyState/EmptyState";

export default function WorkflowsTemplatesView() {
  const actionData = useTypedActionData<WorkflowsTemplatesApi.ActionData>();
  const submit = useSubmit();
  const params = useParams();

  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"json" | "templates">("templates");
  const [searchInput, setSearchInput] = useState<string>("");
  const [configuration, setConfiguration] = useState<string>(
    DefaultWorkflowTemplates.length > 0 ? JSON.stringify(DefaultWorkflowTemplates[0], null, "\t") : "{}"
  );
  const [filteredItems, setFilteredItems] = useState<WorkflowsTemplateDto[]>(DefaultWorkflowTemplates);

  useEffect(() => {
    if (actionData?.error) {
      setError(actionData.error);
    }
  }, [actionData]);

  useEffect(() => {
    let items = DefaultWorkflowTemplates;
    if (searchInput) {
      items = DefaultWorkflowTemplates.filter((item) => {
        return (
          item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          getBlockTypesUsed(item.workflows)
            .map((f) => `[${f.value}] ${f.name}`)
            .join(", ")
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        );
      });
    }
    setFilteredItems(items);
  }, [searchInput]);

  function getBlockTypesUsed(workflows: WorkflowsTemplateDto["workflows"]) {
    const types = workflows.flatMap((workflow) => workflow.blocks.map((block) => block.type));
    const uniqueTypes = [...new Set(types)];
    let blockTypes: { name: string; value: string }[] = [];
    uniqueTypes.forEach((type) => {
      blockTypes.push({
        name: WorkflowUtils.getBlockTypeName({ type }),
        value: type,
      });
    });
    return blockTypes;
  }
  return (
    <EditPageLayout
      title="Workflow Templates"
      buttons={
        <>
          {mode === "templates" && <InputSearch className="w-64" value={searchInput} setValue={setSearchInput} />}
          <ButtonSecondary onClick={() => setMode(mode === "json" ? "templates" : "json")}>
            {mode === "json" ? "Browse Templates" : "Import from JSON"}
          </ButtonSecondary>
        </>
      }
    >
      <div className="md:border-t md:border-gray-200 md:py-2">
        {error ? (
          <div className="space-y-1">
            <p id="form-error-message" className="py-2 text-sm text-rose-500" role="alert">
              {error}
            </p>
            <button type="button" className="text-sm font-medium text-gray-600 underline hover:text-gray-500" onClick={() => setError(null)}>
              Try again
            </button>
          </div>
        ) : actionData?.success ? (
          <>
            <div id="form-success-message" className="space-y-1 py-2 text-sm text-gray-800">
              {actionData.success}
            </div>
            <Link
              to={UrlUtils.getModulePath(params, `workflow-engine/workflows`)}
              className="text-sm font-medium text-theme-600 underline hover:text-theme-500"
            >
              View all workflows
            </Link>
          </>
        ) : (
          <div>
            {mode === "templates" && (
              <div className="space-y-3">
                {filteredItems.length === 0 && (
                  <div>
                    <EmptyState
                      className="bg-white"
                      captions={{
                        thereAreNo: "There are no workflows",
                      }}
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredItems.map((item) => {
                    return (
                      <button
                        type="button"
                        key={item.title}
                        className="flex w-full flex-col items-start overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm hover:cursor-pointer hover:border-theme-300 hover:bg-theme-50 focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
                        onClick={() => {
                          const form = new FormData();
                          form.set("action", "preview");
                          form.set("configuration", JSON.stringify(item, null, "\t"));
                          submit(form, {
                            method: "post",
                          });
                        }}
                      >
                        <div className="flex flex-col items-start space-y-2 px-3 py-3">
                          <div className="font-medium text-gray-800">{item.title}</div>
                          <div className="space-y-0.5">
                            <div className="block text-xs font-medium uppercase text-gray-400">Workflows ({item.workflows.length})</div>
                            <ul className="text-sm text-gray-600">
                              {item.workflows.map((f) => {
                                return <li key={f.name}>{f.name}</li>;
                              })}
                            </ul>
                          </div>
                          <div className="space-y-0.5">
                            <div className="block text-xs font-medium uppercase text-gray-400">Block Types</div>
                            <div className="text-sm text-gray-600">
                              {getBlockTypesUsed(item.workflows)
                                .map((f) => f.name)
                                .join(", ")}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {mode === "json" && (
              <Form method="post">
                <input type="hidden" name="action" value="preview" readOnly />
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex space-x-2">
                      {DefaultWorkflowTemplates.map((t) => (
                        <button
                          key={t.title}
                          type="button"
                          onClick={() => setConfiguration(JSON.stringify(t, null, "\t"))}
                          className="inline-flex items-center rounded border border-transparent bg-theme-100 px-2.5 py-1.5 text-xs font-medium text-theme-700 hover:bg-theme-200 focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
                        >
                          {t.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <InputText
                      name="configuration"
                      title="Configuration"
                      editor="monaco"
                      editorLanguage="json"
                      value={configuration}
                      setValue={setConfiguration}
                      editorSize="lg"
                    />
                  </div>
                  <div className="flex justify-end">
                    <LoadingButton type="submit">Import</LoadingButton>
                  </div>
                </div>
              </Form>
            )}
          </div>
        )}
      </div>
    </EditPageLayout>
  );
}
