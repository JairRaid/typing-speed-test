import React, { useState } from "react";
import type { DropdownOption, DropdownProps } from "../Dropdown/Dropdown";

export type DifficultyOption<T = string | number> = DropdownOption<T>;

export interface SelectorProps<T = string | number> extends DropdownProps<T> {
  label?: string;
  id: string;
}

export default function Selector<T = string | number>({
  options,
  value: controlledValue,
  defaultValue = options[0]?.value,
  label,
  onChange,
  id,
  className = "",
}: SelectorProps<T>): React.JSX.Element {
  // Support for uncontrolled component pattern if `value` prop is omitted
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const selectedValue = controlledValue ?? internalValue;

  const handleSelect = (val: T) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <div
      className={`flex items-center gap-x-8 p-4 text-white select-none ${className}`}
    >
      {/* Label with accessible ID binding */}
      <span id={id} className="leading-120 -tracking-048 text-neutral-400">
        {label}:
      </span>

      {/* Accessible Radio Group */}
      <div
        role="radiogroup"
        aria-labelledby={id}
        className="flex items-center gap-x-6"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`
                border border-neutral-500 rounded-8 px-10 py-6 focus-visible:outline-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2
                ${
                  isSelected
                    ? "border-blue-400! text-blue-400 "
                    : "border-neutral-500 text-white hover:border-neutral-300/70 focus-visible:border-white"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
