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
    <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-sm rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-700 bg-slate-800/50 text-slate-200 rounded-xl
                       text-sm outline-none transition-colors
                       focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
                       placeholder:text-slate-500"
          />
          {/* Clear search input */}
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setFilters({ search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter indicator + clear all */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span
                className="bg-teal-500 text-slate-950 text-xs rounded-full
                               w-5 h-5 flex items-center justify-center font-bold"
              >
                {activeFilterCount}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300
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
          className="px-3 py-2 border border-slate-700 rounded-xl text-sm
                     outline-none bg-slate-800/50 transition-colors
                     focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
                     text-slate-300"
        >
          <option className="bg-slate-900 text-slate-200" value="">
            All types
          </option>
          <option className="bg-slate-900 text-slate-200" value="income">
            Income
          </option>
          <option className="bg-slate-900 text-slate-200" value="expense">
            Expense
          </option>
        </select>

        {/* Category filter */}
        <select
          name="category"
          value={filters.category}
          onChange={handleSelectChange}
          className="px-3 py-2 border border-slate-700 rounded-xl text-sm
                     outline-none bg-slate-800/50 transition-colors
                     focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
                     text-slate-300"
        >
          <option className="bg-slate-900 text-slate-200" value="">
            All categories
          </option>
          <optgroup className="bg-slate-900 text-slate-400" label="Expense">
            {categories
              .filter((c) => c.type === "expense")
              .map((c) => (
                <option
                  className="bg-slate-900 text-slate-200"
                  key={c._id}
                  value={c.name}
                >
                  {c.icon} {c.name}
                </option>
              ))}
          </optgroup>
          <optgroup className="bg-slate-900 text-slate-400" label="Income">
            {categories
              .filter((c) => c.type === "income")
              .map((c) => (
                <option
                  className="bg-slate-900 text-slate-200"
                  key={c._id}
                  value={c.name}
                >
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
          className="px-3 py-2 border border-slate-700 rounded-xl text-sm
             outline-none transition-colors bg-slate-800/50
             focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
             text-slate-300"
        />

        {/* End date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleDateChange}
          min={filters.startDate}
          max={new Date().toISOString().split("T")[0]}
          className="px-3 py-2 border border-slate-700 rounded-xl text-sm
                     outline-none transition-colors bg-slate-800/50
                     focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
                     text-slate-300"
        />
      </div>
    </div>
  );
}

export default FilterBar;
