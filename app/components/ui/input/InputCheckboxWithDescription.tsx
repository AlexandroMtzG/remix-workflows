import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import HintTooltip from "../tooltips/HintTooltip";

interface Props {
  name?: string;
  title?: string | ReactNode;
  description: string | ReactNode;
  value?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  help?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}
export default function InputCheckboxWithDescription({ name, title, value, setValue, description, className, help, disabled = false, autoFocus }: Props) {
  const [checked, setChecked] = useState(value ?? false);

  useEffect(() => {
    if (value !== checked) {
      setChecked(value ?? false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (setValue && value !== checked) {
      setValue(checked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <div className={clsx("relative flex items-start pb-4 pt-2", className)}>
      <div className="min-w-0 flex-1 text-sm">
        <label htmlFor={name} className="cursor-pointer select-none">
          <div className="font-medium text-gray-700">{title}</div>

          {help && <HintTooltip text={help} />}

          <div id={name + "-description"} className="text-gray-400">
            {description}
          </div>
        </label>
      </div>
      <div className="ml-3 flex h-5 items-center">
        <input
          id={name}
          aria-describedby={name + "-description"}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
          disabled={disabled}
          autoFocus={autoFocus}
          className={clsx(disabled && "cursor-not-allowed bg-gray-100", "h-4 w-4 cursor-pointer rounded border-gray-300 text-accent-600 focus:ring-accent-500")}
        />
      </div>
    </div>
  );
}
