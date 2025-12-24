import { useState, useEffect, useRef, useMemo } from "react";

interface Option {
  value: string;
  label: string;
  searchText?: string; // Additional text to search (e.g., price, duration, category)
}

interface SearchableMultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selected: string[]) => void;
  className?: string;
  defaultValue?: string[];
  disabled?: boolean;
  searchPlaceholder?: string;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  placeholder = "Select options",
  onChange,
  className = "",
  defaultValue = [],
  disabled = false,
  searchPlaceholder = "Search...",
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update selected values when defaultValue changes
  useEffect(() => {
    if (defaultValue !== undefined) {
      setSelectedValues(defaultValue);
    }
  }, [defaultValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;

    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(lowerSearch);
      const searchTextMatch = option.searchText?.toLowerCase().includes(lowerSearch);
      return labelMatch || searchTextMatch;
    });
  }, [options, searchTerm]);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      const newSelected = selectedValues.filter((v) => v !== value);
      setSelectedValues(newSelected);
      onChange(newSelected);
    } else {
      const newSelected = [...selectedValues, value];
      setSelectedValues(newSelected);
      onChange(newSelected);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = selectedValues.filter((v) => v !== value);
    setSelectedValues(newSelected);
    onChange(newSelected);
  };

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleToggle(filteredOptions[focusedIndex].value);
        } else if (!isOpen) {
          handleToggleDropdown();
        }
        e.preventDefault();
        break;
      case "ArrowDown":
        if (isOpen) {
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        } else {
          handleToggleDropdown();
        }
        e.preventDefault();
        break;
      case "ArrowUp":
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
        break;
    }
  };

  const getSelectedLabels = () => {
    return selectedValues
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        className={`min-h-11 w-full flex items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs cursor-pointer transition focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800 ${
          selectedValues.length > 0
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex flex-wrap gap-2 flex-1">
          {selectedValues.length > 0 ? (
            getSelectedLabels().map((label, index) => {
              const value = selectedValues[index];
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-brand-100 text-brand-800 rounded-md text-xs dark:bg-brand-900/30 dark:text-brand-300"
                >
                  {label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(value, e)}
                      className="hover:text-brand-600 dark:hover:text-brand-200"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })
          ) : (
            <span className="text-gray-400 dark:text-gray-400">{placeholder}</span>
          )}
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700 max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className={`px-4 py-2 cursor-pointer transition-colors ${
                      index === focusedIndex
                        ? "bg-brand-50 dark:bg-brand-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    } ${
                      isSelected
                        ? "bg-brand-100 dark:bg-brand-900/30 font-medium"
                        : ""
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-800 dark:text-white/90">
                          {option.label}
                        </div>
                        {option.searchText && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {option.searchText}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <svg
                          className="h-5 w-5 text-brand-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableMultiSelect;

