import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ProductFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState({
    brand: [],
    processor: [],
    ram: [],
    storage: [],
    minPrice: 0,
    maxPrice: 200000,
  });
  const [openSections, setOpenSections] = useState({
    brand: true,
    processor: true,
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
    "AMD Ryzen",
  ];
  const ramOptions = ["4GB", "8GB", "16GB", "32GB"];
  const storageOptions = [
    "128GB SSD",
    "256GB SSD",
    "512GB SSD",
    "1TB SSD",
    "1TB HDD",
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

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      {/* Brand Filter */}
      <div className="mb-4 border-b pb-3">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full font-semibold text-gray-900"
        >
          Brand
          {openSections.brand ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.brand && (
          <div className="mt-3 space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => handleCheckboxChange("brand", brand)}
                  className="rounded border-gray-300 text-blue-600"
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
          {openSections.processor ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.processor && (
          <div className="mt-3 space-y-2">
            {processors.map((proc) => (
              <label key={proc} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.processor.includes(proc)}
                  onChange={() => handleCheckboxChange("processor", proc)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">{proc}</span>
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
          {openSections.ram ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.ram && (
          <div className="mt-3 space-y-2">
            {ramOptions.map((ram) => (
              <label key={ram} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.ram.includes(ram)}
                  onChange={() => handleCheckboxChange("ram", ram)}
                  className="rounded border-gray-300 text-blue-600"
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
          {openSections.storage ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections.storage && (
          <div className="mt-3 space-y-2">
            {storageOptions.map((storage) => (
              <label key={storage} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.storage.includes(storage)}
                  onChange={() => handleCheckboxChange("storage", storage)}
                  className="rounded border-gray-300 text-blue-600"
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
          {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
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
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Rs 0</span>
              <span>Rs {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
