import { Fragment, useContext } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getStraightPath } from "reactflow";
import WorkflowContext from "../../context/WorkflowContext";
import clsx from "clsx";

export default function CustomEdge({ id, data, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: EdgeProps) {
  const { isReadOnly, onEdgeDelete } = useContext(WorkflowContext);
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    // sourcePosition,
    targetX,
    targetY,
    // targetPosition,
  });
  const condition = data.condition as string | null;
  const isExecuted = data.isExecuted as boolean | undefined;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 1.5,
          opacity: isExecuted ? 1 : 0.5,
          transition: "stroke 0.3s, opacity 0.3s",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {condition ? (
            <button
              className={clsx(
                "rounded-md border px-1 py-0.5",
                !isReadOnly && "group",
                condition === "true"
                  ? "border-green-300 bg-green-50 text-green-800"
                  : condition === "false"
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-gray-300 bg-gray-50 text-gray-800"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onEdgeDelete(id);
              }}
              disabled={isReadOnly}
            >
              <span className=" group-hover:hidden">{condition}</span>
              <span className="hidden group-hover:block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </span>
            </button>
          ) : (
            <Fragment>
              {!isReadOnly && (
                <button
                  className="rounded-full bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdgeDelete(id);
                  }}
                >
                  <svg
                    className="h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
            </Fragment>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
