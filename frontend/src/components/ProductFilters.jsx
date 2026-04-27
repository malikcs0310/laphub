import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ProductFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState({
    brand: [],
    processor: [],
    generation: [],
    ram: [],
    storage: [],
    minPrice: 0,
    maxPrice: 200000,
  });
  const [openSections, setOpenSections] = useState({
    brand: true,
    processor: true,
    generation: true,
    ram: true,
    storage: true,
    price: true,
  });

  const brands = ["Dell", "HP", "Lenovo", "Apple", "ASUS", "Acer"];

  const processors = [
    "Intel Core i3",
    "Intel Core i5",
    "Intel Core i7",
    "Intel Core i9",
    "AMD Ryzen 3",
    "AMD Ryzen 5",
    "AMD Ryzen 7",
    "AMD Ryzen 9",
  ];

  const generations = [
    "Intel Core 3rd Gen",
    "Intel Core 4th Gen",
    "Intel Core 5th Gen",
    "Intel Core 6th Gen",
    "Intel Core 7th Gen",
    "Intel Core 8th Gen",
    "Intel Core 9th Gen",
    "Intel Core 10th Gen",
    "Intel Core 11th Gen",
    "Intel Core 12th Gen",
    "Intel Core 13th Gen",
    "Intel Core 14th Gen",
    "AMD Ryzen 3",
    "AMD Ryzen 5",
    "AMD Ryzen 7",
    "AMD Ryzen 9",
  ];

  const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB"];

  const storageOptions = [
    "128GB SSD",
    "256GB SSD",
    "512GB SSD",
    "1TB SSD",
    "2TB SSD",
    "1TB HDD",
    "2TB HDD",
  ];

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (type, value) => {
    const current = filters[type];
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const newFilters = { ...filters, [type]: newValues };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    const newFilters = { ...filters, maxPrice: newMax };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = () => {
    let count =
      filters.brand.length +
      filters.processor.length +
      filters.generation.length +
      filters.ram.length +
      filters.storage.length;
    if (filters.minPrice > 0 || filters.maxPrice < 200000) count++;
    return count;
  };

  const clearAllFilters = () => {
    const resetFilters = {
      brand: [],
      processor: [],
      generation: [],
      ram: [],
      storage: [],
      minPrice: 0,
      maxPrice: 200000,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3 pb-2 border-b">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {activeFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          Brand
          {openSections.brand ? (
            <FiChevronUp size={16} />
          ) : (
            <FiChevronDown size={16} />
          )}
        </button>
        {openSections.brand && (
          <div className="mt-3 space-y-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleCheckboxChange("brand", brand)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Processor Filter */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("processor")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          Processor
          {openSections.processor ? (
            <FiChevronUp size={16} />
          ) : (
            <FiChevronDown size={16} />
          )}
        </button>
        {openSections.processor && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {processors.map((proc) => (
              <label
                key={proc}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.processor.includes(proc)}
                  onChange={() => handleCheckboxChange("processor", proc)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{proc}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Generation Filter - NEW */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("generation")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          Generation
          {openSections.generation ? (
            <FiChevronUp size={16} />
          ) : (
            <FiChevronDown size={16} />
          )}
        </button>
        {openSections.generation && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {generations.map((gen) => (
              <label
                key={gen}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.generation.includes(gen)}
                  onChange={() => handleCheckboxChange("generation", gen)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{gen}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* RAM Filter */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("ram")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          RAM
          {openSections.ram ? (
            <FiChevronUp size={16} />
          ) : (
            <FiChevronDown size={16} />
          )}
        </button>
        {openSections.ram && (
          <div className="mt-3 space-y-2">
            {ramOptions.map((ram) => (
              <label
                key={ram}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.ram.includes(ram)}
                  onChange={() => handleCheckboxChange("ram", ram)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{ram}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Storage Filter */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("storage")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          Storage
          {openSections.storage ? (
            <FiChevronUp size={16} />
          ) : (
            <FiChevronDown size={16} />
          )}
        </button>
        {openSections.storage && (
          <div className="mt-3 space-y-2">
            {storageOptions.map((storage) => (
              <label
                key={storage}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.storage.includes(storage)}
                  onChange={() => handleCheckboxChange("storage", storage)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{storage}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          Price Range
          {openSections.price ? (
            <FiChevronUp size={16} />
          ) : (
            <FiChevronDown size={16} />
          )}
        </button>
        {openSections.price && (
          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-600">Rs 0</span>
              <span className="text-blue-600 font-semibold">
                Up to Rs {filters.maxPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
