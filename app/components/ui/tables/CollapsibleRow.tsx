import { Menu } from "@headlessui/react";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import DropdownOptions from "../dropdowns/DropdownOptions";
import OpenCloseArrowIcon from "../icons/OpenCloseArrowIcon";

export interface RefSimpleRow {}

interface Props {
  value: ReactNode;
  title: ReactNode;
  children: ReactNode;
  onRemove?: () => void;
  initial?: boolean;
  className?: string;
  disabled?: boolean;
  draggable?: boolean;
  opened?: boolean;
}

export default function CollapsibleRow({ value, title, children, onRemove, initial = false, className, disabled, draggable, opened }: Props) {
  const [open, setOpen] = useState(initial);

  useEffect(() => {
    if (opened !== undefined) {
      setOpen(opened);
    }
  }, [opened]);

  return (
    <div
      className={clsx(
        className,
        "rounded-md border-2 border-dashed border-gray-300 bg-white p-2",
        draggable && "hover:cursor-move hover:border-dashed hover:border-gray-800 hover:bg-gray-100"
      )}
    >
      <div className="flex items-center justify-between space-x-2">
        <button type="button" onClick={() => setOpen(!open)} className={clsx("w-full truncate text-left text-sm", draggable && "hover:cursor-move")}>
          {!open ? <span className=" text-gray-500">{value ?? "Empty"}</span> : <span className=" font-medium text-gray-800">{title}</span>}
        </button>
        <div className=" flex flex-shrink-0 items-center space-x-2">
          {onRemove && (
            <DropdownOptions
              options={
                <div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={onRemove}
                        disabled={disabled}
                        className={clsx(
                          "w-full text-left",
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                          "block px-4 py-2 text-sm",
                          disabled && "cursor-not-allowed"
                        )}
                      >
                        Remove
                      </button>
                    )}
                  </Menu.Item>
                </div>
              }
            ></DropdownOptions>
          )}
          <OpenCloseArrowIcon open={open} setOpen={setOpen} />
        </div>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}
