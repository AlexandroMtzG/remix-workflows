import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type ItemDto = {
  value: string;
  name: string;
  bottomText?: string;
  icon?: JSX.Element;
};
export default function RadioGroupCards({
  title,
  name,
  items,
  value,
  onChange,
}: {
  title: string;
  name: string;
  items: ItemDto[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroup value={value} onChange={onChange}>
      <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">{title}</RadioGroup.Label>
      <input type="hidden" name={name} value={value} />
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {items.map((item) => (
          <RadioGroup.Option
            key={item.value}
            value={item.value}
            className={({ checked, active }) =>
              clsx(
                checked ? "border-transparent" : "border-gray-300",
                active ? "border-gray-600 ring-2 ring-gray-600" : "",
                "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col w-full">
                    {item.icon ? (
                      <div className="flex justify-center w-full">{item.icon}</div>
                    ) : (
                      <>
                        <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                          {item.value}
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className="mt-1 flex items-center text-sm text-gray-500">
                          {item.name}
                        </RadioGroup.Description>
                        {item.bottomText && (
                          <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                            {item.bottomText}
                          </RadioGroup.Description>
                        )}
                      </>
                    )}
                  </span>
                </span>
                <CheckCircleIcon className={clsx(!checked ? "invisible" : "", "h-5 w-5 text-teal-600")} aria-hidden="true" />
                <span
                  className={clsx(
                    active ? "border" : "border-2",
                    checked ? "border-gray-600" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
