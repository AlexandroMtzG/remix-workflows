import { useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { WorkflowsDangerApi } from "./danger.api.server";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { useTypedLoaderData } from "remix-typedjson";
import DropdownOptions from "~/components/ui/dropdowns/DropdownOptions";
import { Menu } from "@headlessui/react";
import clsx from "clsx";

export default function WorkflowsDangerView() {
  const data = useTypedLoaderData<WorkflowsDangerApi.LoaderData>();
  const actionData = useActionData<WorkflowsDangerApi.ActionData>();
  const submit = useSubmit();

  const confirmReset = useRef<RefConfirmModal>(null);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }
  }, [actionData]);

  function onReset(type: string) {
    confirmReset.current?.setValue(type);
    if (type === "reset-all-data") {
      confirmReset.current?.show("Reset data", "Reset", "Cancel", "All workflows, executions, and variables will be deleted.");
    } else if (type === "delete-all-executions") {
      confirmReset.current?.show("Delete all executions", "Delete", "Cancel", "All executions will be deleted.");
    } else if (type === "delete-all-variables") {
      confirmReset.current?.show("Delete all variables", "Delete", "Cancel", "All variables will be deleted.");
    } else if (type === "delete-all-workflows") {
      confirmReset.current?.show("Delete all workflows", "Delete", "Cancel", "All workflows will be deleted.");
    }
  }

  function onResetConfirm(type: string) {
    const form = new FormData();
    form.set("action", type);
    submit(form, {
      method: "post",
    });
  }

  return (
    <div className="h-screen flex-1 overflow-x-auto xl:overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Danger</h1>

        <div className="divide-y-gray-200 mt-6 space-y-8 divide-y">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-6">
              <h2 className="text-xl font-medium text-gray-900">Reset all data</h2>
              <p className="mt-1 text-sm text-gray-500">Delete all workflows data.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-8">
            <DropdownOptions
              width="w-80"
              button={<div className="rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-red-600 hover:bg-gray-50">Reset data</div>}
              options={
                <div>
                  {[
                    {
                      action: "delete-all-variables",
                      title: `Delete all variables (${data.summary.variables})`,
                    },
                    {
                      action: "delete-all-executions",
                      title: `Delete all executions (${data.summary.executions})`,
                    },
                    {
                      action: "delete-all-workflows",
                      title: `Delete all workflows (${data.summary.workflows})`,
                    },
                    {
                      action: "reset-all-data",
                      title: "Reset all data",
                      className: "text-red-600 font-medium",
                    },
                  ].map((option) => {
                    return (
                      <Menu.Item key={option.action}>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => onReset(option.action)}
                            className={clsx(
                              option.className,
                              "w-full truncate text-left",
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            {option.title}
                          </button>
                        )}
                      </Menu.Item>
                    );
                  })}
                </div>
              }
            ></DropdownOptions>
          </div>
        </div>
      </div>

      <ConfirmModal ref={confirmReset} onYes={onResetConfirm} destructive />
    </div>
  );
}
