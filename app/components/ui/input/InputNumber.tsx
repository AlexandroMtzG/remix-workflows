import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import HintTooltip from "~/components/ui/tooltips/HintTooltip";

export interface RefInputNumber {
  input: RefObject<HTMLInputElement>;
}

interface Props {
  name?: string;
  title?: string;
  withLabel?: boolean;
  value?: number;
  setValue?: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  help?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  hint?: ReactNode;
  step?: string;
  placeholder?: string;
  icon?: string;
  borderless?: boolean;
  autoFocus?: boolean;
  canUnset?: boolean;
}
const InputNumber = (
  {
    name,
    title,
    withLabel = true,
    value,
    setValue,
    className,
    hint,
    help,
    disabled = false,
    readOnly = false,
    required = false,
    min = 0,
    max,
    step,
    placeholder,
    icon,
    borderless,
    autoFocus,
    canUnset,
  }: Props,
  ref: Ref<RefInputNumber>
) => {
  useImperativeHandle(ref, () => ({ input }));
  const input = useRef<HTMLInputElement>(null);

  const [actualValue, setActualValue] = useState<number | undefined>(value);

  useEffect(() => {
    setActualValue(value);
  }, [value]);

  useEffect(() => {
    if (setValue && actualValue) {
      setValue(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);

  return (
    <div className={clsx(className, "text-gray-800")}>
      {withLabel && (
        <label htmlFor={name} className="mb-1 flex justify-between space-x-2 text-xs font-medium text-gray-600">
          <div className=" flex items-center space-x-1">
            <div className="truncate">
              {title}
              {required && <span className="ml-1 text-red-500">*</span>}
            </div>

            {help && <HintTooltip text={help} />}
          </div>
          {canUnset && !required && !disabled && !readOnly && actualValue !== undefined && (
            <button type="button" onClick={() => setActualValue(undefined)} className="text-xs text-gray-500">
              Clear
            </button>
          )}
          {hint}
        </label>
      )}
      <div className={clsx("relative flex w-full rounded-md")}>
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
          </div>
        )}
        <input
          ref={input}
          type="number"
          id={name}
          name={name}
          required={required}
          min={min}
          max={max}
          value={actualValue ?? ""}
          onChange={(e) => setActualValue(Number(e.currentTarget.value))}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          className={clsx(
            "block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm",
            className,
            disabled || readOnly ? "cursor-not-allowed bg-gray-100" : "hover:bg-gray-50 focus:bg-gray-50",
            icon && "pl-10",
            borderless && "border-transparent"
          )}
        />
      </div>
    </div>
  );
};
export default forwardRef(InputNumber);
