import { FormEvent, useEffect, useState } from "react";
import { useSearchParams, useNavigation } from "@remix-run/react";
import Modal from "../modals/Modal";
import Constants from "~/application/Constants";
import clsx from "clsx";
import InputSelector from "../input/InputSelector";
import InputNumber from "../input/InputNumber";
import ButtonPrimary from "../buttons/ButtonPrimary";
import ButtonSecondary from "../buttons/ButtonSecondary";

interface Props {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export default function TablePagination({ page, pageSize, totalItems, totalPages }: Props) {
  const [state, setState] = useState<{ page: number; pageSize: number | undefined }>({ page, pageSize });
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  // const submit = useSubmit();
  const navigation = useNavigation();
  const loading = navigation.state === "loading" || navigation.state === "submitting";
  const [searchParams, setSearchParams] = useSearchParams();

  const [showPageSizeModal, setShowPageSizeModal] = useState(false);
  const [showPageNumberModal, setShowPageNumberModal] = useState(false);

  useEffect(() => {
    setFrom(page * pageSize - pageSize + 1);

    let to = page * pageSize;
    if (to > totalItems) {
      to = totalItems;
    }
    setTo(to);
  }, [page, pageSize, totalItems]);

  useEffect(() => {
    const pageSizeParam = searchParams.get("pageSize")?.toString() ?? Constants.DEFAULT_PAGE_SIZE.toString();
    const pageParam = searchParams.get("page")?.toString() ?? "1";
    if (state.page.toString() !== pageParam || state.pageSize?.toString() !== pageSizeParam) {
      if (state.page.toString() !== pageParam) {
        searchParams.set("page", state.page.toString());
      }
      if (state.pageSize?.toString() !== pageSizeParam) {
        if (state.pageSize) {
          searchParams.set("pageSize", state.pageSize.toString());
        } else {
          searchParams.delete("pageSize");
        }
      }
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      className="flex items-center justify-end border-t bg-gray-50 px-4 py-3 text-xs uppercase tracking-wide text-gray-500 sm:justify-between"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        {totalItems > 0 && (
          <button type="button" onClick={() => setShowPageSizeModal(true)} className="uppercase hover:underline">
            {"Showing"} <span className="font-medium">{totalItems === 0 ? 0 : from}</span> {"To"} <span className="font-medium">{to}</span> {"Of"}{" "}
            <span className="font-medium">{totalItems}</span> {"Results"}
          </button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <select
          id="pageSize"
          name="pageSize"
          className={clsx(
            "inline-flex items-center justify-center rounded border border-gray-200 bg-white text-xs focus:border-accent-500 focus:ring-accent-500",
            page === 1 || loading ? "cursor-not-allowed opacity-90" : "hover:border-gray-300 hover:bg-gray-50"
          )}
          onChange={(e) => setState({ ...state, pageSize: Number(e.target.value) })}
          value={state.pageSize}
        >
          {[undefined, ...Constants.PAGE_SIZE_OPTIONS].map((f, idx) => {
            return (
              <option key={idx} value={Number(f ?? Constants.DEFAULT_PAGE_SIZE)} className="lowercase">
                {f === undefined ? Constants.DEFAULT_PAGE_SIZE : f} {"Per page"?.toLowerCase()}
              </option>
            );
          })}
        </select>
        <div className="inline-flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 1 || loading}
            onClick={() => setState({ ...state, page: page - 1 })}
            className={clsx(
              "inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500",
              page === 1 || loading ? "cursor-not-allowed opacity-90" : "hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {showPageNumberModal ? (
            <input
              type="number"
              min={1}
              max={totalPages}
              disabled={totalPages <= 1}
              value={state.page}
              onChange={(e) => setState({ ...state, page: parseInt(e.target.value) })}
              onBlur={() => setShowPageNumberModal(false)}
              className="block w-full min-w-0 flex-1 rounded border-gray-200 text-xs focus:border-accent-500 focus:ring-accent-500"
            />
          ) : (
            <button type="button" onClick={() => setShowPageSizeModal(true)} className={clsx("uppercase hover:underline")}>
              {page}
              <span className="mx-0.25">/</span>
              {totalPages === 0 ? 1 : totalPages}
            </button>
          )}

          <button
            type="button"
            className={clsx(
              "inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500",
              page >= totalPages || loading ? "cursor-not-allowed opacity-90" : "hover:border-gray-300 hover:bg-gray-50"
            )}
            disabled={page >= totalPages || loading}
            onClick={() => setState({ ...state, page: page + 1 })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <Modal className="sm:max-w-xs" open={showPageSizeModal} setOpen={setShowPageSizeModal}>
        <PageOptionsForm
          page={state.page}
          pageSize={state.pageSize}
          totalItems={totalItems}
          onChange={(e) => {
            setState({
              page: e.currentPage,
              pageSize: e.pageSize,
            });
            setShowPageSizeModal(false);
          }}
        />
      </Modal>
    </div>
  );
}

function PageOptionsForm({
  page,
  pageSize,
  onChange,
  totalItems,
}: {
  page: number;
  pageSize?: number;
  totalItems?: number;
  onChange: (state: { currentPage: number; pageSize?: number }) => void;
}) {
  const [totalPages, setTotalPages] = useState(0);
  const [state, setState] = useState({ currentPage: page, pageSize: pageSize });

  useEffect(() => {
    if (totalItems) {
      setTotalPages(Math.ceil(totalItems / (state.pageSize || Constants.DEFAULT_PAGE_SIZE)));
    }
  }, [state.pageSize, totalItems]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    onChange(state);
  }
  function onReset() {
    onChange({ currentPage: 1, pageSize: undefined });
  }
  function existingChanges() {
    return state.pageSize !== Constants.DEFAULT_PAGE_SIZE || state.currentPage !== 1;
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <InputSelector
          withSearch={false}
          title={"Page Size"}
          value={state.pageSize}
          setValue={(e) => setState({ ...state, pageSize: Number(e) })}
          options={[undefined, ...Constants.PAGE_SIZE_OPTIONS].map((size) => {
            return {
              value: size,
              name: size === undefined ? "Default" : size.toString(),
            };
          })}
        />
      </div>
      <div>
        <InputNumber
          title={"Page"}
          hint={
            <div className="text-gray-600">
              {"Total pages"}: {totalPages}
            </div>
          }
          value={state.currentPage}
          min={1}
          max={totalPages}
          setValue={(e) => setState({ ...state, currentPage: Number(e) })}
        />
      </div>
      <div className="flex justify-between space-x-2">
        <ButtonSecondary disabled={!existingChanges()} onClick={onReset} className="flex justify-center text-center">
          Reset
        </ButtonSecondary>
        <ButtonPrimary type="submit" className="flex justify-center text-center">
          Apply
        </ButtonPrimary>
      </div>
    </form>
  );
}

// function PageSize({ number, onSelected }: { number?: number; onSelected: () => void }) {
//   const { t } = useTranslation();
//   const [searchParams] = useSearchParams();
//   return (
//     <button onClick={onSelected} className="w-full bg-white p-2 text-center text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900">
//       <div className="flex items-center justify-center space-x-2">
//         {number === undefined ? <div className="text-gray-400">{t("shared.default")}</div> : <div>{number}</div>}
//         <div>
//           {searchParams.get("pageSize") === number?.toString() || (number === undefined && !searchParams.get("pageSize")) ? (
//             <CheckIcon className="h-3 w-3 text-teal-500" />
//           ) : null}
//         </div>
//       </div>
//     </button>
//   );
// }
