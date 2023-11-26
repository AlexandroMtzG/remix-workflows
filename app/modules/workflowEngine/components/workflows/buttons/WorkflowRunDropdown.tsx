import { Menu } from "@headlessui/react";
import { Link, useParams } from "@remix-run/react";
import clsx from "clsx";
import { Fragment } from "react";
import DropdownOptions from "~/components/ui/dropdowns/DropdownOptions";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import UrlUtils from "~/utils/app/UrlUtils";

export default function WorkflowRunDropdown({ workflow }: { workflow: WorkflowDto }) {
  const params = useParams();
  return (
    <DropdownOptions
      disabled={!WorkflowUtils.canRun(workflow)}
      button={
        <div
          className={clsx(
            "rounded px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300",
            WorkflowUtils.canRun(workflow) ? "bg-white hover:bg-gray-100" : "cursor-not-allowed bg-gray-100 opacity-50"
          )}
        >
          <div>Run {!WorkflowUtils.canRun(workflow) && <span className="text-xs opacity-50"> (not live)</span>}</div>
        </div>
      }
      options={
        <div>
          {[
            {
              name: "Manually",
              value: UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}/run/manual`),
              disabled: !WorkflowUtils.canRun(workflow),
            },
            {
              name: "API call (Core and Enterprise)",
              disabled: true,
            },
            {
              name: "Stream (Enterprise-only)",
              disabled: true,
            },
          ].map((option) => {
            return (
              <Menu.Item key={option.name}>
                {({ active, close }) => (
                  <Fragment>
                    {option.disabled || !option.value ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          close();
                        }}
                        disabled={true}
                        className={clsx(
                          "w-full truncate text-left hover:bg-gray-100",
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                          option.disabled && "cursor-not-allowed bg-gray-100 opacity-50",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {option.name}
                      </button>
                    ) : (
                      <Link
                        to={option.value}
                        type="button"
                        onClick={(e) => {
                          close();
                        }}
                        className={clsx(
                          "w-full truncate text-left hover:bg-gray-100",
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {option.name}
                      </Link>
                    )}
                  </Fragment>
                )}
              </Menu.Item>
            );
          })}
        </div>
      }
    ></DropdownOptions>
  );
}
