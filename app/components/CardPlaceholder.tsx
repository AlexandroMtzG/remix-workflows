import React from "react";

const CardPlaceholder = () => {
  return (
    <div role="status" className="p-4 border border-gray-100 rounded shadow animate-pulse md:p-6 dark:border-gray-200">
      <div className="flex items-center justify-center h-48 mb-4 bg-gray-200 rounded dark:bg-gray-300"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-48 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-300"></div>
      <div className="flex items-center mt-4 space-x-3">
        <div>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-300 w-32 mb-2"></div>
          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-300"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default CardPlaceholder;
