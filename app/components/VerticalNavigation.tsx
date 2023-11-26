import { Link } from "@remix-run/react";
import clsx from "clsx";

export default function VerticalNavigation({
  navigation,
}: {
  navigation: {
    name: string;
    href: string;
    current: boolean;
    render?: () => JSX.Element;
  }[];
}) {
  return (
    <nav className="space-y-1" aria-label="Sidebar">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={clsx(
            item.current ? "border-gray-800 bg-gray-800 text-white" : "border-transparent text-gray-400 hover:bg-gray-900 hover:text-gray-50",
            "flex w-full items-center rounded-md border px-3 py-2 text-sm font-medium"
          )}
          aria-current={item.current ? "page" : undefined}
        >
          {item.render ? item.render() : item.name}
        </Link>
      ))}
    </nav>
  );
}
