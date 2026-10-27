import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption<T = string | number> {
  label: string;
  value: T;
}

export interface DropdownProps<T = string | number> {
  options: DropdownOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}

export default function Dropdown<T = string | number>({
  options,
  value,
  defaultValue = options[0]?.value,
  onChange,
  className = "",
}: DropdownProps<T>): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [internalSelected, setInternalSelected] = useState<T>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalSelected;

  // Find the currently selected option to display its label
  const selectedOption =
    options.find((opt) => opt.value === selectedValue) || options[0];

  const handleSelect = (option: DropdownOption<T>) => {
    if (!isControlled) {
      setInternalSelected(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-x-10 px-10 py-6 leading-120 -tracking-048 text-white border border-neutral-500 rounded-8 transition-all duration-200 focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-offset-2"
      >
        <span className="">{selectedOption?.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="6"
          fill="none"
          viewBox="0 0 11 6"
          className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          <path
            fill="#fff"
            d="M4.742 5.836.117 1.242c-.156-.125-.156-.375 0-.531L.742.117a.36.36 0 0 1 .531 0l3.75 3.688L8.743.117c.155-.156.405-.156.53 0l.625.594c.157.156.157.406 0 .531L5.273 5.836a.36.36 0 0 1-.53 0"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+.4375rem)] w-full bg-neutral-800 rounded-8 shadow-2xl overflow-hidden z-50 flex flex-col divide-y divide-neutral-700">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full flex items-center gap-x-12 px-10 py-8 text-left hover:bg-neutral-700/50 focus-visible:outline-none focus-visible:bg-neutral-700/50 transition-colors group"
              >
                {/* Radio Indicator */}
                <div className="flex items-center justify-center min-w-16 min-h-16">
                  {isSelected ? (
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-neutral-900" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full border border-white group-hover:border-neutral-300 transition-colors" />
                  )}
                </div>
                <span className="-tracking-048 text-white">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
