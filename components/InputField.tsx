"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface InputFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "number" | "text" | "range";
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  placeholder?: string;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  step = 1,
  prefix,
  suffix,
  tooltip,
  placeholder,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium"
          style={{ color: "#d1d5db" }}
        >
          {label}
        </label>
        {tooltip && (
          <div className="tooltip">
            <Info size={14} style={{ color: "#6b7280", cursor: "help" }} />
            <span className="tooltip-text">{tooltip}</span>
          </div>
        )}
      </div>

      <div
        className="flex items-center rounded-xl transition-all duration-200 overflow-hidden"
        style={{
          border: focused
            ? "1.5px solid #00d084"
            : "1.5px solid rgba(30,58,112,0.6)",
          background: "rgba(10,22,40,0.8)",
          boxShadow: focused ? "0 0 0 3px rgba(0,208,132,0.1)" : "none",
        }}
      >
        {prefix && (
          <span
            className="px-3 py-3 text-sm font-medium select-none"
            style={{
              color: "#9ca3af",
              borderRight: "1.5px solid rgba(30,58,112,0.4)",
              background: "rgba(15,32,66,0.6)",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-label={label}
          className="flex-1 px-4 py-3 text-sm font-medium bg-transparent outline-none text-white placeholder-gray-600"
        />
        {suffix && (
          <span
            className="px-3 py-3 text-sm font-medium select-none"
            style={{
              color: "#9ca3af",
              borderLeft: "1.5px solid rgba(30,58,112,0.4)",
              background: "rgba(15,32,66,0.6)",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
