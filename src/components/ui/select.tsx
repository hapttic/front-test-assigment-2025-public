import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      placeholder,
      error,
      className,
      children,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", containerClassName)}>
        {label && (
          <label
            htmlFor={label}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-nowrap h-6"
          >
            {label}
          </label>
        )}
        <select
          id={label}
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 text-base bg-white dark:bg-gray-800 border rounded-lg appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 pr-9",
            error
              ? "border-red-500 focus:ring-red-500 dark:border-red-600"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 hover:border-gray-400 dark:hover:border-gray-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        {/* Custom dropdown arrow */}
        <div
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200",
            {
              "opacity-50": props.disabled,
              "top-[calc(50%+12px)]": label,
            }
          )}
        >
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
