import { Outlet, useParams } from "@remix-run/react";
import IncreaseIcon from "~/components/ui/icons/crm/IncreaseIcon";
import IncreaseIconFilled from "~/components/ui/icons/crm/IncreaseIconFilled";
import WorkflowExecutionIcon from "~/modules/workflowEngine/components/icons/WorkflowExecutionIcon";
import WorkflowExecutionIconFilled from "~/modules/workflowEngine/components/icons/WorkflowExecutionIconFilled";
import WorkflowIcon from "~/modules/workflowEngine/components/icons/WorkflowIcon";
import WorkflowIconFilled from "~/modules/workflowEngine/components/icons/WorkflowIconFilled";
import WorkflowVariableIcon from "~/modules/workflowEngine/components/icons/WorkflowVariableIcon";
import WorkflowVariableIconFilled from "~/modules/workflowEngine/components/icons/WorkflowVariableIconFilled";
import SidebarIconsLayout from "~/components/ui/layouts/SidebarIconsLayout";
import UrlUtils from "~/utils/app/UrlUtils";
import TemplateIcon from "~/components/ui/icons/TemplateIcon";
import TemplateIconFilled from "~/components/ui/icons/TemplateIconFilled";

export default function WorkflowEngineView() {
  const params = useParams();
  return (
    <SidebarIconsLayout
      label={{ align: "right" }}
      items={[
        {
          name: "Overview",
          href: UrlUtils.getModulePath(params, `workflow-engine`),
          exact: true,
          icon: <IncreaseIcon className="h-5 w-5" />,
          iconSelected: <IncreaseIconFilled className="h-5 w-5" />,
        },
        {
          name: "Workflows",
          href: UrlUtils.getModulePath(params, `workflow-engine/workflows`),
          icon: <WorkflowIcon className="h-5 w-5" />,
          iconSelected: <WorkflowIconFilled className="h-5 w-5" />,
        },
        {
          name: "Variables",
          href: UrlUtils.getModulePath(params, `workflow-engine/variables`),
          icon: <WorkflowVariableIcon className="h-5 w-5" />,
          iconSelected: <WorkflowVariableIconFilled className="h-5 w-5" />,
        },
        {
          name: "Executions",
          href: UrlUtils.getModulePath(params, `workflow-engine/executions`),
          icon: <WorkflowExecutionIcon className="h-5 w-5" />,
          iconSelected: <WorkflowExecutionIconFilled className="h-5 w-5" />,
        },
        {
          name: "Templates",
          href: UrlUtils.getModulePath(params, `workflow-engine/templates`),
          icon: <TemplateIcon className="h-5 w-5" />,
          iconSelected: <TemplateIconFilled className="h-5 w-5" />,
          bottom: true,
        },
        {
          name: "Danger",
          href: UrlUtils.getModulePath(params, `workflow-engine/danger`),
          bottom: true,
          icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ),
          iconSelected: (
            <svg className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          ),
        },
      ]}
    >
      <Outlet />
    </SidebarIconsLayout>
  );
}
