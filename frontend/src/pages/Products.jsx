import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
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

    // Brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter((p) => filters.brand.includes(p.brand));
    }

    // Processor filter
    if (filters.processor.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.processor.some((proc) =>
          p.processor?.toLowerCase().includes(proc.toLowerCase()),
        );
      });
    }

    // RAM filter
    if (filters.ram.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.ram.some((ram) =>
          p.ram?.toLowerCase().includes(ram.toLowerCase()),
        );
      });
    }

    // Storage filter
    if (filters.storage.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.storage.some((storage) =>
          p.storage?.toLowerCase().includes(storage.toLowerCase()),
        );
      });
    }

    // Price filter
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

  // If loading, show ProductCard's loading skeleton
  if (loading) {
    return <ProductCard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All Laptops
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {search
              ? `Search results for "${search}"`
              : `Browse our collection of premium laptops`}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
          >
            <FiFilter />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <ProductFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
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
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Products - Using existing ProductCard component */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FiFilter className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500">
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
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto lg:hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX />
              </button>
            </div>
            <div className="p-4">
              <ProductFilters
                onFilterChange={setFilters}
                initialFilters={filters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
