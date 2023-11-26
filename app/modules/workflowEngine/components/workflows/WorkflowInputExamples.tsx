import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import MonacoEditor from "~/components/editors/MonacoEditor";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import { WorkflowInputExampleDto } from "../../dtos/WorkflowInputExampleDto";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";

export default function WorkflowInputExamples({ workflow }: { workflow: WorkflowDto }) {
  const submit = useSubmit();
  const [addingInputExample, setAddingInputExample] = useState(false);
  const [selectedInputExample, setSelectedInputExample] = useState<WorkflowInputExampleDto | null>(null);

  function onCreate(item: WorkflowInputExampleDto) {
    setSelectedInputExample(null);
    setAddingInputExample(false);
    const form = new FormData();
    form.set("action", "create-input-example");
    form.set("title", item.title);
    form.set("input", JSON.stringify(item.input));
    submit(form, {
      method: "post",
    });
  }
  function onUpdate(item: WorkflowInputExampleDto) {
    if (!item.id) {
      return;
    }
    setSelectedInputExample(null);
    setAddingInputExample(false);
    const form = new FormData();
    form.set("action", "update-input-example");
    form.set("id", item.id || "");
    form.set("title", item.title);
    form.set("input", JSON.stringify(item.input));
    submit(form, {
      method: "post",
    });
  }
  function onDelete(item: WorkflowInputExampleDto) {
    if (!item.id) {
      return;
    }
    setSelectedInputExample(null);
    setAddingInputExample(false);
    const form = new FormData();
    form.set("action", "delete-input-example");
    form.set("id", item.id || "");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div>
      <div className="space-y-3">
        <div className="space-y-0.5 text-sm">
          <div className="font-medium text-gray-700">Input examples</div>
          <div className="text-gray-400">Examples of input data</div>
        </div>
        <div className="space-y-2">
          {workflow.inputExamples.map((inputExample) => {
            return (
              <button
                type="button"
                key={inputExample.id}
                className="w-full rounded-md border border-dotted border-gray-300 bg-gray-50 p-2 hover:border-dashed hover:bg-gray-100"
                onClick={() => {
                  setAddingInputExample(false);
                  setSelectedInputExample(inputExample);
                }}
              >
                <div className="flex justify-between space-x-2">
                  <div className="font-sm flex-shrink-0 text-xs text-gray-700">{inputExample.title}</div>
                  <div className="truncate text-xs text-gray-500">{JSON.stringify(inputExample.input, null, 2)}</div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            className="w-full rounded-md border border-dotted border-gray-300 bg-white p-2 hover:border-dashed hover:bg-gray-50"
            onClick={() => {
              setAddingInputExample(true);
              setSelectedInputExample(null);
            }}
          >
            <div className="font-sm text-xs text-gray-700">- Add input example -</div>
          </button>
        </div>
      </div>

      <SlideOverWideEmpty
        open={!!selectedInputExample}
        title={"Edit input example: " + selectedInputExample?.title}
        onClose={() => setSelectedInputExample(null)}
        className="sm:max-w-sm"
      >
        <WorkflowInputExampleForm item={selectedInputExample} onSave={onUpdate} onDelete={onDelete} onCancel={() => setSelectedInputExample(null)} />
      </SlideOverWideEmpty>

      <SlideOverWideEmpty open={addingInputExample} title={"Add input example"} onClose={() => setAddingInputExample(false)} className="sm:max-w-sm">
        <WorkflowInputExampleForm item={null} onSave={onCreate} onCancel={() => setAddingInputExample(false)} />
      </SlideOverWideEmpty>
    </div>
  );
}

function WorkflowInputExampleForm({
  item,
  onSave,
  onCancel,
  onDelete,
}: {
  item: WorkflowInputExampleDto | null;
  onSave: (item: WorkflowInputExampleDto) => void;
  onCancel: () => void;
  onDelete?: (item: WorkflowInputExampleDto) => void;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [input, setInput] = useState(
    item?.input
      ? JSON.stringify(item.input, null, 2)
      : JSON.stringify(
          {
            sample: "value",
          },
          null,
          2
        )
  );

  const mainInput = useRef<RefInputText>(null);
  useEffect(() => {
    setTimeout(() => {
      mainInput.current?.input.current?.focus();
    }, 100);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let inputJson: { [key: string]: any } = {};
    try {
      inputJson = JSON.parse(input);
    } catch (e) {
      toast.error("Invalid JSON");
      return;
    }
    onSave({
      id: item?.id || undefined,
      title,
      input: inputJson,
    });
  }
  return (
    <Form onSubmit={onSubmit}>
      <div className="space-y-1">
        <InputText ref={mainInput} title="Title" value={title} setValue={setTitle} required />
        <div className="overflow-hidden">
          <label className="mb-1 block text-sm font-medium text-gray-700">Input</label>
          <MonacoEditor theme="vs-dark" className=" h-80" value={input} onChange={setInput} language="json" tabSize={2} hideLineNumbers />
        </div>
      </div>
      <div className="mt-2 border-t border-gray-200 pt-2">
        <div className="flex justify-between space-x-2">
          <div>
            {onDelete && item && (
              <ButtonSecondary destructive onClick={() => onDelete(item)}>
                Delete
              </ButtonSecondary>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ButtonSecondary type="button" onClick={onCancel}>
              Cancel
            </ButtonSecondary>
            <ButtonPrimary type="submit">Save</ButtonPrimary>
          </div>
        </div>
      </div>
    </Form>
  );
}
