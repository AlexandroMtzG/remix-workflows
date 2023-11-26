import { Outlet } from "@remix-run/react";
import { useTypedLoaderData } from "remix-typedjson";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import DateCell from "~/components/ui/dates/DateCell";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import TableSimple from "~/components/ui/tables/TableSimple";
import { WorkflowsVariablesApi } from "./variables.api.server";

export default function WorkflowsVariablesView() {
  const data = useTypedLoaderData<WorkflowsVariablesApi.LoaderData>();

  return (
    <IndexPageLayout
      title="Variables"
      buttons={
        <>
          <ButtonPrimary to="new">New</ButtonPrimary>
        </>
      }
    >
      <div className="space-y-3">
        <TableSimple
          headers={[
            {
              title: "Name",
              name: "name",
              value: (item) => `{{$vars.${item.name}}}`,
            },
            {
              title: "Value",
              name: "value",
              className: "w-full",
              value: (item) => item.value,
            },
            {
              title: "Created At",
              name: "createdAt",
              value: (item) => <DateCell date={item.createdAt} />,
            },
          ]}
          items={data.items}
          actions={[
            {
              title: "Edit",
              onClickRoute: (idx, item) => item.id,
            },
          ]}
        />
      </div>
      <Outlet />
    </IndexPageLayout>
  );
}
