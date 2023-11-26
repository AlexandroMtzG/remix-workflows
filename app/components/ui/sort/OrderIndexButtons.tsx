import clsx from "clsx";

interface OrderType {
  idx: number;
  order: number;
}
interface Props<OrderType> {
  idx: number;
  items: OrderType[];
  editable?: boolean;
  onChange: (orders: OrderType[]) => void;
  className?: string;
}
export default function OrderIndexButtons({ idx, items, editable = true, onChange, className }: Props<OrderType>) {
  function changeOrder(forward: boolean) {
    const currentItem = items[idx];
    let nextItem: OrderType | undefined = undefined;
    let prevItem: OrderType | undefined = undefined;

    if (forward) {
      if (items.length > idx + 1) {
        nextItem = items[idx + 1];
      }
    } else {
      if (idx - 1 >= 0) {
        prevItem = items[idx - 1];
      }
    }

    const newOrders = items.map((item, idx) => {
      let order = 0;
      if (currentItem.idx === item.idx) {
        order = idx + (forward ? 1 : -1) + 1;
      } else if (prevItem?.idx === item.idx) {
        order = idx + (forward ? 0 : 1) + 1;
      } else if (nextItem?.idx === item.idx) {
        order = idx + (forward ? -1 : 0) + 1;
      } else {
        order = idx + 1;
      }
      return { ...item, order };
    });
    onChange(newOrders);
  }
  return (
    <div className={clsx("flex items-center space-x-1 truncate", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          changeOrder(false);
        }}
        className={clsx(
          !editable || idx <= 0 ? " cursor-not-allowed bg-gray-100 text-gray-300" : "hover:bg-gray-100 hover:text-gray-800",
          "h-4 w-4 bg-gray-50 px-0.5 py-0.5 text-gray-500 focus:outline-none"
        )}
        disabled={!editable || idx <= 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          changeOrder(true);
        }}
        className={clsx(
          !editable || idx >= items.length - 1 ? " cursor-not-allowed bg-gray-100 text-gray-300" : "hover:bg-gray-100 hover:text-gray-800",
          "h-4 w-4 bg-gray-50 px-0.5 py-0.5 text-gray-500 focus:outline-none"
        )}
        disabled={!editable || idx >= items.length - 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
