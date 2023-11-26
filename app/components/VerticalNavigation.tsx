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
            item.current ? "bg-gray-800 text-white border-gray-800" : "text-gray-400 hover:bg-gray-900 hover:text-gray-50 border-transparent",
            "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium border"
          )}
          aria-current={item.current ? "page" : undefined}
        >
          {item.render ? item.render() : item.name}
        </Link>
      ))}
    </nav>
  );
}
