import { useEffect, useRef, useState } from "react";
import FormGroup from "~/components/ui/forms/FormGroup";
import InputText, { RefInputText } from "~/components/ui/input/InputText";

interface Props {
  item?: { id: string; name: string; value: string };
}

export default function WorkflowVariableForm({ item }: Props) {
  const [name, setName] = useState<string>(item?.name || "");
  const [value, setValue] = useState<string>(item?.value ?? "");

  const mainInput = useRef<RefInputText>(null);
  useEffect(() => {
    setTimeout(() => {
      mainInput.current?.input.current?.focus();
    }, 100);
  }, []);

  function isValidName(name: string) {
    // Regular expression for lowercase alphanumeric with dashes
    const regex = /^[a-zA-Z0-9-_]+$/;

    // Test the variable name against the regular expression
    return regex.test(name);
  }

  return (
    <FormGroup id={item?.id} editing={true}>
      <InputText
        ref={mainInput}
        name="name"
        title="Name"
        value={name}
        setValue={setName}
        required
        disabled={!!item?.id}
        placeholder="i.e. gptModel"
        autoComplete="off"
      />
      {name && !isValidName(name) && (
        <div className="text-sm text-red-600">
          <p>Invalid variable name. Don't use spaces or special characters.</p>
        </div>
      )}
      <InputText name="value" title="Value" value={value} setValue={setValue} required placeholder="i.e. gpt-4" autoComplete="off" />
    </FormGroup>
  );
}
