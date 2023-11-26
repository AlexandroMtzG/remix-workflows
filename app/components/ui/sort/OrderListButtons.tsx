import clsx from "clsx";
import { useSubmit, useNavigation } from "@remix-run/react";

interface OrderType {
  id: string;
  order: number;
}
interface Props<OrderType> {
  index: number | undefined;
  items: OrderType[];
  editable?: boolean;
  actionName?: string;
  formData?: {
    [key: string]: string;
  };
}
export default function OrderListButtons({ index, items, editable = true, actionName = "set-orders", formData }: Props<OrderType>) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  function changeOrder(forward: boolean) {
    if (index === undefined) {
      return;
    }
    const form = new FormData();

    const currentItem = items[index];
    let nextItem: OrderType | undefined = undefined;
    let prevItem: OrderType | undefined = undefined;
    if (forward) {
      if (items.length > index + 1) {
        nextItem = items[index + 1];
      }
    } else {
      if (index - 1 >= 0) {
        prevItem = items[index - 1];
      }
    }

    items.forEach((item, idx) => {
      let order = 0;
      if (currentItem.id === item.id) {
        order = idx + (forward ? 1 : -1) + 1;
      } else if (prevItem?.id === item.id) {
        order = idx + (forward ? 0 : 1) + 1;
        form.append("orders[]", JSON.stringify({ id: item.id, order: order.toString() }));
      } else if (nextItem?.id === item.id) {
        order = idx + (forward ? -1 : 0) + 1;
        form.append("orders[]", JSON.stringify({ id: item.id, order: order.toString() }));
      } else {
        order = idx + 1;
        form.append("orders[]", JSON.stringify({ id: item.id, order: order.toString() }));
      }
      form.append("orders[]", JSON.stringify({ id: item.id, order: order.toString() }));
    });
    form.set("action", actionName);
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        form.set(key, value);
      });
    }
    submit(form, {
      method: "post",
    });
  }
  function isLastItem() {
    return index === items.length - 1;
    // const maxOrder = Math.max(...items.map((o) => o.order));
    // return order === maxOrder;
  }
  return (
    <>
      {index !== undefined && (
        <div className="flex items-center space-x-1 truncate">
          <button
            title="Move up"
            type="button"
            onClick={() => changeOrder(false)}
            className={clsx(
              index <= 0 || !editable || loading ? " cursor-not-allowed bg-gray-100 text-gray-300" : "hover:bg-gray-100 hover:text-gray-800",
              "h-4 w-4 bg-gray-50 px-0.5 py-0.5 text-gray-500 focus:outline-none"
            )}
            disabled={index <= 0 || !editable || loading}
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
            title="Move down"
            type="button"
            onClick={() => changeOrder(true)}
            className={clsx(
              isLastItem() || !editable || loading ? " cursor-not-allowed bg-gray-100 text-gray-300" : "hover:bg-gray-100 hover:text-gray-800",
              "h-4 w-4 bg-gray-50 px-0.5 py-0.5 text-gray-500 focus:outline-none"
            )}
            disabled={isLastItem() || !editable || loading}
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
      )}
    </>
  );
}
