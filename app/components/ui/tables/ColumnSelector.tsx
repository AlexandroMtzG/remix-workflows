import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { Form } from "@remix-run/react";
import { ColumnDto } from "~/application/dtos/data/ColumnDto";
import { useOuterClick } from "~/utils/shared/KeypressUtils";
import { updateItemByIdx } from "~/utils/shared/ObjectUtils";
import DotsHorizontalFilledIcon from "../icons/DotsHorizontalFilledIcon";
import InputCheckboxInline from "../input/InputCheckboxInline";

interface Props {
  items: ColumnDto[];
  setItems: React.Dispatch<React.SetStateAction<ColumnDto[]>>;
  onClear: () => void;
  className?: string;
}

export default function ColumnSelector({ items, setItems, onClear, className }: Props) {
  const [opened, setOpened] = useState(false);

  const clickOutside = useOuterClick(() => setOpened(false));

  return (
    <div ref={clickOutside} className={clsx("relative", className)}>
      <button
        onClick={() => setOpened(!opened)}
        className="relative z-0 inline-flex rounded-md text-sm shadow-sm hover:bg-gray-50 focus:z-10 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
      >
        <span className={clsx("relative inline-flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-2 py-3 font-medium text-gray-600")}>
          <div>
            <DotsHorizontalFilledIcon className="h-3 w-3" />
          </div>
        </span>
      </button>

      <Transition
        as={Fragment}
        show={opened}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Form
          method="get"
          className="absolute right-0 z-40 mt-2 w-64 origin-top-right divide-y divide-gray-200 overflow-visible rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="flex items-center justify-between bg-gray-50 px-2 py-2 text-sm">
            <div className="font-bold">Columns</div>
          </div>
          <div className="divide-y divide-gray-200 text-sm">
            {items.map((filter, idx) => {
              return (
                <div key={filter.name} className="divide-y divide-gray-200">
                  <div className="divide-y divide-gray-300 px-2 py-2">
                    <InputCheckboxInline
                      name={filter.name}
                      title={filter.title}
                      value={filter.visible}
                      setValue={(e) => {
                        updateItemByIdx(items, setItems, idx, {
                          visible: Boolean(e),
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Form>
      </Transition>
    </div>
  );
}
