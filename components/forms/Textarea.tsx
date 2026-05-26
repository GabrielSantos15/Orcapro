import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        {...props}
        rows={props.rows || 4}
        className="w-full rounded-lg border-2 border-purple-300 bg-white px-4 py-3 text-gray-900 
                   placeholder-purple-300 shadow-sm focus:border-purple-500 focus:ring-2 
                   focus:ring-purple-300 focus:outline-none transition duration-200 resize-y"
      />
    </div>
  );
}
