import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX, FiSliders } from "react-icons/fi";
import ProductCard from "../components/admin/ProductCard";
import ProductFilters from "../components/ProductFilters";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: [],
    processor: [],
    ram: [],
    storage: [],
    minPrice: 0,
    maxPrice: 200000,
  });

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = search
          ? `${API_URL}/api/laptops?search=${encodeURIComponent(search)}`
          : `${API_URL}/api/laptops`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const productsData = Array.isArray(data) ? data : data.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.log("Error fetching products:", error);
        toast.error("Failed to load products");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, API_URL]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (filters.brand.length > 0) {
      filtered = filtered.filter((p) => filters.brand.includes(p.brand));
    }

    if (filters.processor.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.processor.some((proc) =>
          p.processor?.toLowerCase().includes(proc.toLowerCase()),
        );
      });
    }

    if (filters.ram.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.ram.some((ram) =>
          p.ram?.toLowerCase().includes(ram.toLowerCase()),
        );
      });
    }

    if (filters.storage.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.storage.some((storage) =>
          p.storage?.toLowerCase().includes(storage.toLowerCase()),
        );
      });
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    );

    setFilteredProducts(filtered);
  }, [filters, products]);

  const activeFilterCount =
    filters.brand.length +
    filters.processor.length +
    filters.ram.length +
    filters.storage.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            All Laptops
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {search
              ? `Search results for "${search}"`
              : `Browse our premium laptop collection`}
          </p>
        </div>

        {/* Mobile Filter Bar - Sticky */}
        <div className="sticky top-0 z-20 bg-gray-50 pt-2 pb-3 sm:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm active:bg-gray-50 transition"
            >
              <FiFilter className="text-gray-600 text-sm" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={() =>
                  setFilters({
                    brand: [],
                    processor: [],
                    ram: [],
                    storage: [],
                    minPrice: 0,
                    maxPrice: 200000,
                  })
                }
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-blue-600 active:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Filter Chips - Mobile */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {filters.brand.map((b) => (
                <span
                  key={b}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {b}
                </span>
              ))}
              {filters.processor.map((p) => (
                <span
                  key={p}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {p}
                </span>
              ))}
              {filters.ram.map((r) => (
                <span
                  key={r}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {r}
                </span>
              ))}
              {filters.storage.map((s) => (
                <span
                  key={s}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Count - Mobile Friendly */}
        <div className="mb-3 sm:mb-4 flex justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-500">
            <span className="font-semibold text-gray-700">
              {filteredProducts.length}
            </span>{" "}
            products found
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() =>
                setFilters({
                  brand: [],
                  processor: [],
                  ram: [],
                  storage: [],
                  minPrice: 0,
                  maxPrice: 200000,
                })
              }
              className="hidden sm:block text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <ProductFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Products Grid - Mobile Optimized */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <>
                {/* Desktop Results Count (hidden on mobile) */}
                <div className="hidden sm:flex justify-end mb-3">
                  <p className="text-sm text-gray-500">
                    Showing {filteredProducts.length} of {products.length}{" "}
                    products
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FiFilter className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      brand: [],
                      processor: [],
                      ram: [],
                      storage: [],
                      minPrice: 0,
                      maxPrice: 200000,
                    })
                  }
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer - Bottom Sheet Style */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 shadow-xl rounded-t-2xl overflow-y-auto lg:hidden transform transition-transform duration-300">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 pb-8">
              <ProductFilters
                onFilterChange={setFilters}
                initialFilters={filters}
              />

              {/* Apply Button for Mobile */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-base transition"
              >
                Apply Filters ({activeFilterCount})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
