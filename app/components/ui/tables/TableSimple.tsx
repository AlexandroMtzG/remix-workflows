import clsx from "clsx";
import { useNavigate, useSearchParams } from "@remix-run/react";
import ButtonTertiary from "../buttons/ButtonTertiary";
import TablePagination from "./TablePagination";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import DownArrow from "../icons/DownArrow";
import UpArrow from "../icons/UpArrow";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import RowDisplayValueHelper from "~/utils/helpers/RowDisplayValueHelper";
import { RowHeaderActionDto } from "~/utils/helpers/RowHeaderActionDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";

interface Props<T> {
  headers: RowHeaderDisplayDto<T>[];
  items: T[];
  actions?: RowHeaderActionDto<T>[];
  pagination?: PaginationDto;
  onClickRoute?: (idx: number, item: T) => string;
  selectedRows?: T[];
  onSelected?: (item: T[]) => void;
  className?: (idx: number, item: T) => string;
  padding?: string;
  noRecords?: ReactNode;
  emptyState?: { title: string; description: string; icon?: ReactNode };
}

export default function TableSimple<T>(props: Props<T>) {
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return <Table {...props} />;
}

function Table<T>({
  headers,
  items,
  actions = [],
  pagination,
  onClickRoute,
  selectedRows,
  onSelected,
  className,
  padding = "px-2 py-2",
  noRecords,
  emptyState,
}: Props<T>) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<{ by: string; order: "asc" | "desc" }[]>();

  useEffect(() => {
    let sort = searchParams.get("sort");
    const sortArray = sort?.split(",") ?? [];
    const sortObject = sortArray.map((s) => {
      let order: "asc" | "desc" = "asc";
      if (s.startsWith("-")) {
        order = "desc";
      }
      return { by: s.replace("-", ""), order };
    });
    setSortBy(sortObject);
  }, [searchParams]);
  // const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // useEffect(() => {
  //   if (onSelected) {
  //     onSelected(selectedRows);
  //   }
  // }, [selectedRows]);

  function toggleSelected(_: number, item: T) {
    if (!selectedRows || !onSelected) {
      return;
    }
    if (selectedRows.includes(item)) {
      onSelected(selectedRows.filter((i) => i !== item));
    } else {
      onSelected([...selectedRows, item]);
    }
  }

  const checkbox = useRef(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useLayoutEffect(() => {
    if (!selectedRows || !onSelected) {
      return;
    }
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < items.length;
    setChecked(selectedRows.length === items.length && items.length > 0);
    setIndeterminate(isIndeterminate);
    // @ts-ignore
    checkbox.current.indeterminate = isIndeterminate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelected, selectedRows]);

  function toggleAll() {
    if (!selectedRows || !onSelected) {
      return;
    }
    onSelected(checked || indeterminate ? [] : items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  function onHeaderClick(header: RowHeaderDisplayDto<T>) {
    if (!header.sortBy) {
      return;
    }
    let currentSort = sortBy?.find((s) => s.by === header.sortBy);
    let newSort = header.sortBy;
    if (currentSort?.order === "asc") {
      newSort = `-${header.sortBy}`;
    }
    searchParams.set("sort", newSort);
    setSearchParams(searchParams);
  }

  function getSortDirection(header: RowHeaderDisplayDto<T>) {
    if (!header.sortBy) {
      return;
    }
    let currentSort = sortBy?.find((s) => s.by === header.sortBy);
    if (!currentSort) {
      return;
    }
    return currentSort.order;
  }

  return (
    <div className="shadow-xs w-full overflow-hidden rounded-lg border border-gray-200">
      <div className="w-full overflow-x-auto">
        <table className="whitespace-no-wrap w-full">
          <thead className="bg-gray-50">
            <tr className="border-b bg-gray-50 text-left text-xs font-semibold tracking-wide text-gray-500">
              {actions.filter((f) => f.firstColumn).length > 0 && <th scope="col" className="px-2 py-1"></th>}
              {onSelected && (
                <th scope="col" className="relative w-12 px-6 py-5 sm:w-16 sm:px-8">
                  <input
                    title="Select all"
                    ref={checkbox}
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-theme-600 focus:ring-theme-500 sm:left-6"
                    checked={checked}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {headers.map((header, idxHeader) => {
                return (
                  <th
                    key={idxHeader}
                    scope="col"
                    onClick={() => onHeaderClick(header)}
                    className={clsx(
                      idxHeader === 0 && actions.filter((f) => f.firstColumn).length === 0 && "pl-3",
                      "whitespace-nowrap px-2 py-2 tracking-wider",
                      header.breakpoint === "sm" && "hidden sm:table-cell",
                      header.breakpoint === "md" && "mg:table-cell hidden",
                      header.breakpoint === "lg" && "hidden lg:table-cell",
                      header.breakpoint === "xl" && "hidden xl:table-cell",
                      header.breakpoint === "2xl" && "hidden 2xl:table-cell",
                      header.sortBy && "cursor-pointer"
                    )}
                  >
                    <div
                      className={clsx(
                        "group flex space-x-2",
                        !header.align && "justify-between",
                        header.align === "right" && "justify-end",
                        header.align === "center" && "justify-center",
                        header.align === "left" && "justify-start"
                      )}
                    >
                      <div className={clsx(header.className, "truncate")}>{header.title}</div>
                      {header.sortBy && (
                        <div className="text text-gray-500 group-hover:text-gray-800">
                          {getSortDirection(header) === "desc" ? (
                            <DownArrow className="h-4 w-4" />
                          ) : (
                            getSortDirection(header) === "asc" && <UpArrow className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              {actions.filter((f) => !f.firstColumn).length > 0 && <th scope="col" className="px-2 py-1"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.length === 0 ? (
              <tr className="text-gray-700">
                <td colSpan={headers.length + actions.length + (onSelected ? 1 : 0)} className="text-center">
                  {noRecords ?? (
                    <div className="p-3 text-sm text-gray-500">
                      {!emptyState ? (
                        <span>No records found</span>
                      ) : (
                        <div className="space-y-1">
                          <div className="font-medium">{emptyState.title}</div>
                          <div>{emptyState.description}</div>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              items.map((item, idxRow) => {
                return (
                  <tr
                    key={idxRow}
                    onClick={() => {
                      if (onClickRoute !== undefined) {
                        navigate(onClickRoute(idxRow, item));
                      }
                    }}
                    className="group text-gray-700"
                  >
                    <ActionsCells actions={actions.filter((f) => f.firstColumn)} className={className} item={item} idxRow={idxRow} />
                    {onSelected && (
                      <td className="relative w-12 px-6 text-gray-700 sm:w-16 sm:px-8">
                        {selectedRows?.includes(item) && <div className="absolute inset-y-0 left-0 w-0.5 bg-theme-600" />}
                        <div className="flex items-center space-x-1">
                          <input
                            title="Select"
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-theme-600 focus:ring-theme-500 sm:left-6"
                            checked={selectedRows?.includes(item)}
                            onChange={(e) => {
                              toggleSelected(idxRow, item);
                            }}
                          />
                        </div>
                      </td>
                    )}
                    {headers.map((header, idxHeader) => {
                      return (
                        <td
                          key={idxHeader}
                          className={clsx(
                            idxHeader === 0 && actions.filter((f) => f.firstColumn).length === 0 && "pl-4",
                            "whitespace-nowrap text-sm text-gray-700",
                            header.className,
                            padding ?? "px-2 py-2",
                            header.breakpoint === "sm" && "hidden sm:table-cell",
                            header.breakpoint === "md" && "mg:table-cell hidden",
                            header.breakpoint === "lg" && "hidden lg:table-cell",
                            header.breakpoint === "xl" && "hidden xl:table-cell",
                            header.breakpoint === "2xl" && "hidden 2xl:table-cell",
                            className && className(idxRow, item)
                          )}
                        >
                          {RowDisplayValueHelper.displayRowValue(header, item, idxRow)}
                        </td>
                      );
                    })}
                    <ActionsCells actions={actions.filter((f) => !f.firstColumn)} className={className} item={item} idxRow={idxRow} />
                  </tr>
                );
              })
            )}

            {/* {[...Array(pageSize - items.length)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={headers.length + 1} className="whitespace-nowrap text-sm text-gray-600">
                      <div className="px-2 py-2.5 invisible">No row</div>
                    </td>
                  </tr>
                ))} */}
          </tbody>
        </table>
      </div>
      {pagination && (
        <TablePagination totalItems={pagination.totalItems} totalPages={pagination.totalPages} page={pagination.page} pageSize={pagination.pageSize} />
      )}
    </div>
  );
}

function ActionsCells<T>({
  item,
  actions,
  idxRow,
  className,
}: {
  item: T;
  actions: RowHeaderActionDto<T>[];
  idxRow: number;
  className?: (idx: number, item: T) => string;
}) {
  return (
    <>
      {actions && actions.length > 0 && (
        <td className={clsx("whitespace-nowrap px-2 py-1", className && className(idxRow, item))}>
          <div className="flex space-x-2">
            {actions
              .filter((f) => !f.hidden || !f.hidden(item))
              .map((action, idx) => {
                return (
                  <ButtonTertiary
                    disabled={action.disabled !== undefined ? action.disabled(item) : action.disabled}
                    key={idx}
                    destructive={action.renderIsDestructive !== undefined ? action.renderIsDestructive(item) : action.destructive}
                    onClick={() => {
                      if (action.onClick) {
                        action.onClick(idxRow, item);
                      }
                    }}
                    to={action.onClickRoute && action.onClickRoute(idxRow, item)}
                    target={action.onClickRouteTarget}
                  >
                    {action.renderTitle ? action.renderTitle(item) : action.title}
                  </ButtonTertiary>
                );
              })}
          </div>
        </td>
      )}
    </>
  );
}
