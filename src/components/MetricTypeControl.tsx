import { useState, useRef, useEffect } from "react";
import { MetricType, type MetricTypeControlProps } from "../types/types";

function MetricTypeControl({ metricType, setMetricType }: MetricTypeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: MetricType.REVENUE, label: "Revenue" },
    { value: MetricType.CLICKS, label: "Clicks" },
  ];

  const selectedOption = options.find((opt) => opt.value === metricType);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-900 border border-white/5 rounded-md px-4 py-2.5 text-white/80 text-xs 
                   flex items-center gap-3 min-w-[140px] justify-between
                   hover:border-white/10 transition-colors duration-200
                   focus:outline-none focus:ring-1 focus:ring-white/20"
      >
        <span>{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-0 mt-1 w-full z-50
                    bg-zinc-900 border border-white/5 rounded overflow-hidden
                    shadow-xl shadow-black/20
                    transition-all duration-200 origin-top
                    ${isOpen 
                      ? "opacity-100 scale-y-100 translate-y-0" 
                      : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                    }`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setMetricType(option.value);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-xs transition-colors duration-150
                       ${option.value === metricType
                         ? "bg-white/10 text-white"
                         : "text-white/70 hover:bg-white/5 hover:text-white"
                       }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MetricTypeControl;