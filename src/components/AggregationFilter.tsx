"use client";

import { useState, useRef, useEffect } from "react";
import type { AggregationFilterProps } from "../types";

export default function AggregationFilter({
  value,
  onChange,
  options,
}: AggregationFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-32">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-3 py-2 border rounded-md bg-white shadow-sm hover:bg-[#f9f9f9]"
      >
        <span className="capitalize">{value}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown  */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 capitalize hover:bg-gray-100 ${
                opt === value ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
