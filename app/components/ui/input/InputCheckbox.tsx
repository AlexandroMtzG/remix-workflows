import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import HintTooltip from "~/components/ui/tooltips/HintTooltip";

export interface RefInputCheckbox {
  input: RefObject<HTMLInputElement>;
}

interface Props {
  name?: string;
  title?: string;
  withLabel?: boolean;
  value?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  asToggle?: boolean;
  readOnly?: boolean;
  hint?: ReactNode;
  help?: string;
  icon?: string;
  autoFocus?: boolean;
}
const InputCheckbox = (
  { name, title, withLabel = true, value, setValue, className, required, disabled, asToggle, readOnly, hint, help, icon, autoFocus }: Props,
  ref: Ref<RefInputCheckbox>
) => {
  useImperativeHandle(ref, () => ({ input }));
  const input = useRef<HTMLInputElement>(null);

  const [actualValue, setActualValue] = useState(value ?? false);

  useEffect(() => {
    setActualValue(value ?? false);
  }, [value]);

  useEffect(() => {
    if (setValue && actualValue !== value) {
      setValue(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);

  return (
    <div className={clsx(className, "text-gray-800")}>
      {withLabel && title && (
        <label htmlFor={name} className="mb-1 flex justify-between space-x-2 text-xs font-medium text-gray-600">
          <div className=" flex items-center space-x-1">
            <div className="truncate">
              {title}
              {required && <span className="ml-1 text-red-500">*</span>}
            </div>
            <div className="">{help && <HintTooltip text={help} />}</div>
          </div>
          {hint}
        </label>
      )}
      <div className={clsx("relative flex w-full rounded-md")}>
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
          </div>
        )}
        <input type="hidden" readOnly name={name} value={actualValue === true ? "true" : "false"} />
        {asToggle ? (
          <Switch
            checked={actualValue}
            onChange={setActualValue}
            disabled={disabled || readOnly}
            autoFocus={autoFocus}
            className={clsx(
              actualValue ? "bg-teal-600" : "bg-gray-200",
              "relative inline-flex h-5 w-8 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
              icon && "pl-10",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                actualValue ? "translate-x-3" : "translate-x-0",
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        ) : (
          <input
            type="checkbox"
            id={name}
            name={name}
            readOnly={readOnly}
            onChange={(e) => setActualValue(e.target.checked)}
            disabled={disabled || readOnly}
            autoFocus={autoFocus}
            checked={actualValue}
            className={clsx(
              (disabled || readOnly) && "cursor-not-allowed bg-gray-100",
              "mt-1 h-6 w-6 cursor-pointer rounded border-gray-300 text-accent-800 focus:ring-accent-500",
              className,
              icon && "pl-10"
            )}
          />
        )}
      </div>
    </div>
  );
};
export default forwardRef(InputCheckbox);
