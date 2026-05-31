import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({ label, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...props}
          className="w-full appearance-none rounded-lg border-2 border-purple-300 bg-white px-4 py-3 pr-10 text-gray-900 
                     shadow-sm focus:border-purple-500 focus:ring-2 
                     focus:ring-purple-300 focus:outline-none transition duration-200 cursor-pointer"
        >
          {children}
        </select>

        <ChevronDown
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
