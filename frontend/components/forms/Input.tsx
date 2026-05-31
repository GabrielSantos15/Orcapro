import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full rounded-lg border-2 border-purple-300 bg-white px-4 py-3 text-gray-900 
                   placeholder-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 
                   focus:ring-purple-300 focus:outline-none transition duration-200"
      />
    </div>
  );
}
