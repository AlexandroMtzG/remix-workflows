import { Ref, forwardRef, useImperativeHandle, useRef, ReactNode } from "react";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "../badges/ColorBadge";
import HintTooltip from "../tooltips/HintTooltip";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import clsx from "clsx";

export interface RefInputSelector {
  focus: () => void;
}

interface Props {
  name?: string;
  title?: string;
  value?: string | number | undefined;
  disabled?: boolean;
  options: { name: string | ReactNode; value: string | number | undefined; color?: Colors; disabled?: boolean }[];
  setValue?: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  className?: string;
  withSearch?: boolean;
  withLabel?: boolean;
  withColors?: boolean;
  selectPlaceholder?: string;
  onNew?: () => void;
  onNewRoute?: string;
  required?: boolean;
  help?: string;
  hint?: ReactNode;
  icon?: string;
  borderless?: boolean;
  darkMode?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
}
const InputSelector = (
  {
    name,
    title,
    value,
    options,
    disabled,
    setValue,
    className,
    withSearch = true,
    withLabel = true,
    withColors = false,
    selectPlaceholder,
    onNew,
    required,
    onNewRoute,
    help,
    hint,
    icon,
    borderless,
    darkMode,
    autoFocus,
    readOnly,
  }: Props,
  ref: Ref<RefInputSelector>
) => {
  const button = useRef<HTMLButtonElement>(null);
  const inputSearch = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<{ name: string | ReactNode; value: string | number | undefined; color?: Colors }>();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const selected = options?.find((f) => f.value === value);
    setSelected(selected);
  }, [options, value]);

  useEffect(() => {
    if (selected && setValue && value !== selected?.value) {
      setValue(selected?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useImperativeHandle(ref, () => ({ focus }));
  function focus() {
    setTimeout(() => {
      button.current?.focus();
      button.current?.click();
    }, 1);
  }

  const filteredItems = () => {
    if (!options) {
      return [];
    }
    return options.filter(
      (f) => f.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) || f.value?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };

  return (
    <Listbox value={selected} onChange={setSelected} disabled={disabled || readOnly}>
      {({ open }) => (
        <div className={clsx(className, darkMode ? "text-gray-800 dark:text-gray-50" : "text-gray-800")}>
          {withLabel && title && (
            <Listbox.Label htmlFor={name} className="mb-1 flex justify-between space-x-2 text-xs font-medium text-gray-600">
              <div className=" flex items-center space-x-1">
                <div className="truncate">
                  {title}
                  {required && <span className="ml-1 text-red-500">*</span>}
                </div>

                {help && <HintTooltip text={help} />}
              </div>
              {hint}
            </Listbox.Label>
          )}

          <div className="relative">
            <Listbox.Button
              autoFocus={autoFocus}
              type="button"
              ref={button}
              className={clsx(
                "relative w-full cursor-default rounded-md border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 sm:text-sm",
                darkMode ? "text-gray-800 dark:text-gray-50" : "text-gray-800",
                disabled || readOnly ? "cursor-not-allowed bg-gray-100" : "bg-white hover:bg-gray-50 focus:bg-gray-50",
                borderless && "border-transparent",
                darkMode && "dark:border-gray-800 dark:bg-gray-800"
              )}
            >
              <input type="hidden" readOnly name={name} value={selected?.value ?? ""} />

              {icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
                </div>
              )}

              <span className="inline-flex w-full items-center space-x-2 truncate">
                {withColors && selected && <ColorBadge color={selected?.color ?? Colors.UNDEFINED} />}
                <div className="truncate">
                  {selected ? <span>{selected?.name}</span> : <span className="text-sm text-gray-500">{selectPlaceholder ?? "Select"}...</span>}
                </div>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Listbox.Button>

            <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options
                // onFocus={() => inputSearch.current?.focus()}
                // onBlur={() => setSearchInput("")}
                className={clsx(
                  "absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                  darkMode && "dark:bg-gray-800"
                )}
              >
                {(withSearch || onNew || onNewRoute) && (
                  <div className="flex rounded-md p-2">
                    <div className="relative flex flex-grow items-stretch focus-within:z-10">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        ref={inputSearch}
                        id="search"
                        autoComplete="off"
                        placeholder={"Search..."}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="block w-full rounded-none rounded-l-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm focus:border-accent-300 focus:outline-none focus:ring-gray-300 sm:text-sm"
                      />
                    </div>
                    {onNew && (
                      <button
                        title={"New"}
                        type="button"
                        onClick={onNew}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    )}

                    {onNewRoute && (
                      <Link
                        to={onNewRoute}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Link>
                    )}
                  </div>
                )}

                {filteredItems().map((item, idx) => (
                  <Listbox.Option
                    key={idx}
                    disabled={item.disabled}
                    className={({ active }) =>
                      clsx(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        !item.disabled && active && "bg-accent-600 text-white",
                        !item.disabled && !active && "text-gray-900",
                        item.disabled && "cursor-not-allowed bg-gray-100 text-gray-400",
                        darkMode && !item.disabled && active && "dark:bg-accent-500 dark:text-black",
                        darkMode && !item.disabled && !active && "dark:text-gray-50",
                        darkMode && item.disabled && "cursor-not-allowed dark:bg-gray-900 dark:text-gray-600"
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center space-x-2">
                          {withColors && item.color !== undefined && <ColorBadge color={item.color} />}
                          <div className={clsx(selected ? "font-semibold" : "font-normal", "truncate")}>{item.name}</div>
                        </div>

                        {selected ? (
                          <span className={clsx(active ? "text-white" : "text-accent-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}

                {withSearch && filteredItems().length === 0 && <div className="px-3 py-2 text-sm text-gray-400">There are no records</div>}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};

export default forwardRef(InputSelector);
