import React from "react";

const CardPlaceholder = () => {
  return (
    <div role="status" className="animate-pulse rounded border border-gray-100 p-4 shadow dark:border-gray-200 md:p-6">
      <div className="mb-4 flex h-48 items-center justify-center rounded bg-gray-200 dark:bg-gray-300"></div>
      <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-300"></div>
      <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-300"></div>
      <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-300"></div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-300"></div>
      <div className="mt-4 flex items-center space-x-3">
        <div>
          <div className="mb-2 h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-300"></div>
          <div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-300"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default CardPlaceholder;
