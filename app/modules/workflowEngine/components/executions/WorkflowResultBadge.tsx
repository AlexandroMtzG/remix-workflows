import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { WorkflowStatus } from "../../dtos/WorkflowStatus";
import ShowModalButton from "~/components/ui/json/ShowModalButton";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";

interface Props {
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  status: WorkflowStatus | (string & {});
  error: string | null;
}
enum State {
  Running = "Running",
  Success = "Success",
  Error = "Error",
  WaitingForBlock = "Waiting for block",
  Unknown = "Unknown",
}
export default function WorkflowResultBadge({ startedAt, completedAt, status, error }: Props) {
  function getState() {
    if (status === "running") {
      return State.Running;
    } else if (status === "success") {
      return State.Success;
    } else if (status === "error") {
      return State.Error;
    }
    return State.Unknown;
  }
  function getColor() {
    if (status === "running") {
      return Colors.BLUE;
    } else if (status === "success") {
      return Colors.GREEN;
    } else if (status === "error") {
      return Colors.RED;
    } else {
      return Colors.UNDEFINED;
    }
  }
  return (
    <div>
      {error ? (
        <ShowModalButton title={<SimpleBadge className="hover:underline" title={getState()} color={getColor()} />}>
          <ErrorBanner title="Error" text={error} />
        </ShowModalButton>
      ) : (
        <SimpleBadge title={getState()} color={getColor()} />
      )}
    </div>
  );
}
