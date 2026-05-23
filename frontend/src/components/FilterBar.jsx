import { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import useTransactionStore from "../store/useTransactionStore.js";
import useCategoryStore from "../store/useCategoryStore.js";
import useDebounce from "../utils/useDebounce.js";

function FilterBar() {
  const { filters, setFilters, clearFilters } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();

  // Local state for the search input — updates on every keystroke
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced value — only changes 300ms after user stops typing
  const debouncedSearch = useDebounce(searchInput, 300);

  // Fetch categories once for the dropdown
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, setFilters, filters.search]);

  // Handle type and category selects — no debounce needed, instant filter
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  // Handle date inputs
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  const handleClearAll = () => {
    setSearchInput("");
    clearFilters();
  };

  const activeFilterCount = [
    filters.search,
    filters.type,
    filters.category,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl
                       text-sm outline-none transition-colors
                       focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                       placeholder:text-gray-400"
          />
          {/* Clear search input */}
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setFilters({ search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter indicator + clear all */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span
                className="bg-indigo-600 text-white text-xs rounded-full
                               w-5 h-5 flex items-center justify-center font-medium"
              >
                {activeFilterCount}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-600
                         font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Type filter */}
        <select
          name="type"
          value={filters.type}
          onChange={handleSelectChange}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm
                     outline-none bg-white transition-colors
                     focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                     text-gray-600"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select
          name="category"
          value={filters.category}
          onChange={handleSelectChange}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm
                     outline-none bg-white transition-colors
                     focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                     text-gray-600"
        >
          <option value="">All categories</option>
          <optgroup label="Expense">
            {categories
              .filter((c) => c.type === "expense")
              .map((c) => (
                <option key={c._id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Income">
            {categories
              .filter((c) => c.type === "income")
              .map((c) => (
                <option key={c._id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
          </optgroup>
        </select>

        {/* Start date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleDateChange}
          max={filters.endDate || new Date().toISOString().split("T")[0]}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm
                     outline-none transition-colors bg-white
                     focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                     text-gray-600"
        />

        {/* End date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleDateChange}
          min={filters.startDate}
          max={new Date().toISOString().split("T")[0]}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm
                     outline-none transition-colors bg-white
                     focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                     text-gray-600"
        />
      </div>
    </div>
  );
}

export default FilterBar;
