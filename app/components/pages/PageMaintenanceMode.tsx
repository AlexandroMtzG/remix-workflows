import { Link } from "@remix-run/react";

export default function PageMaintenanceMode() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <h1 className="text-4xl font-bold">Site is under maintenance</h1>
      <p className="text-xl">We are currently performing scheduled maintenance. We should be back shortly.</p>
      <Link to="." className="text-sm text-gray-600 underline dark:text-gray-400">
        Click here to try again
      </Link>
    </div>
  );
}
