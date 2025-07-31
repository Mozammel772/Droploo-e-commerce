import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const PRODUCTS_PER_PAGE = 10;

const fetchProducts = async (page = 1, category, subcategory, sortBy) => {
  let url = `https://backend.droploo.com/api/all-products?page=${page}`;

  if (subcategory) {
    url = `https://backend.droploo.com/api/filter-subcategory-products/${subcategory}?page=${page}`;
  } else if (category) {
    url = `https://backend.droploo.com/api/filter-category-products/${category}?page=${page}`;
  }

  if (sortBy) {
    url += `&sort=${sortBy}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();

  // Log to check shape of response
  console.log("Fetched Product Data:", data);

  // ✅ Update this based on your API's actual structure
  const products = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.products)
    ? data.products
    : [];

  return {
    products,
    totalPages: data.last_page || 1,
    currentPage: data.current_page || 1,
  };
};

const fetchCategories = async () => {
  const res = await fetch("https://backend.droploo.com/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.data || [];
};

const Shop = () => {
  const { category: paramCategory, subcategory: paramSubcategory } =
    useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = paramCategory || searchParams.get("category");
  const subcategory = paramSubcategory || searchParams.get("subcategory");
  const pageParam = searchParams.get("page");
  const sortParam = searchParams.get("sort");

  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(category || null);
    setSelectedSubcategory(subcategory || null);
    setPage(pageParam ? Number(pageParam) : 1);
    setSortBy(sortParam || null);
  }, [category, subcategory, pageParam, sortParam]);

  const {
    data: productsData = { products: [], totalPages: 1, currentPage: 1 },
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products", page, selectedCategory, selectedSubcategory, sortBy],
    queryFn: () =>
      fetchProducts(page, selectedCategory, selectedSubcategory, sortBy),
    keepPreviousData: true,
  });

  const { products, totalPages } = productsData;

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const handleCategoryClick = (categorySlug) => {
    if (selectedCategory === categorySlug) {
      // Clicking the same category again clears selection
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSearchParams({ page: 1, sort: sortBy || undefined });
      setPage(1);
    } else {
      setSelectedCategory(categorySlug);
      setSelectedSubcategory(null);
      setSearchParams({
        category: categorySlug,
        page: 1,
        sort: sortBy || undefined,
      });
      setPage(1);
    }
  };

  const handleSubcategoryClick = (subcategorySlug) => {
    setSelectedSubcategory(subcategorySlug);
    setSearchParams({
      category: selectedCategory,
      subcategory: subcategorySlug,
      page: 1,
      sort: sortBy || undefined,
    });
    setPage(1);
  };

  const handleAllClick = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchParams({ page: 1, sort: sortBy || undefined });
    setPage(1);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (sortType) newParams.set("sort", sortType);
      else newParams.delete("sort");
      newParams.set("page", 1);
      return newParams;
    });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (sortBy) params.sort = sortBy;
    params.page = newPage;
    setSearchParams(params);
  };

  if (isCategoriesError)
    return (
      <p className="text-center text-red-500">
        Failed to load categories. {categoriesError.message}
      </p>
    );

  // এখন দেখব কোন category সিলেক্টেড তার subcategory আছে কিনা
  const selectedCatObj = categories.find((c) => c.slug === selectedCategory);

  // যদি subcategory থাকে, তখন শুধু ঐ category দেখাবে; না হলে সব category দেখাবে
  const displayCategories =
    selectedCategory &&
    selectedCatObj &&
    selectedCatObj.subcategories?.length > 0
      ? categories.filter((c) => c.slug === selectedCategory)
      : categories;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-800 text-white  font-medium px-3 py-1.5 rounded-md transition duration-200"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          <select
            onChange={(e) => handleSortChange(e.target.value)}
            value={sortBy || ""}
            className="border rounded-md px-3 py-1"
          >
            <option value="">Default</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="rating_desc">Highest rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Category & Subcategory Buttons */}

      {isLoadingCategories ? (
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-12 px-4 py-2 rounded-md bg-gray-200 animate-pulse"
              style={{ width: "auto", minWidth: "90px" }}
            ></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            to={"/products-collection"}
            onClick={handleAllClick}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              !selectedCategory && !selectedSubcategory
                ? "bg-teal-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </Link>

          {displayCategories.map((category) => (
            <div key={category.slug} className="flex items-center gap-2">
              <Link
                to={`/products-collection/${category.slug}`}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === category.slug && !selectedSubcategory
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </Link>

              {/* যদি এই category সিলেক্টেড হয় এবং subcategory থাকে তাহলে subcategory গুলো দেখাবে */}
              {selectedCategory === category.slug &&
                category.subcategories?.length > 0 &&
                category.subcategories.map((sub) => (
                  <Link
                    to={`/products-collection/${category.slug}/${sub.slug}`}
                    key={sub.slug}
                    onClick={() => handleSubcategoryClick(sub.slug)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedSubcategory === sub.slug
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
            </div>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
          {[...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 border rounded-md shadow p-3 animate-pulse"
            >
              <div className="skeleton h-52 w-full rounded bg-gray-300"></div>
              <div className="skeleton h-4 w-1/2 bg-gray-300"></div>
              <div className="skeleton h-4 w-2/3 bg-gray-300"></div>
              <div className="skeleton h-8 w-full rounded bg-gray-300"></div>
            </div>
          ))}
        </div>
      ) : isProductsError ? (
        <p className="text-center text-red-500">
          Failed to load products. {productsError.message}
        </p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                First
              </button>

              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      page === pageNum
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && page < totalPages - 2 && (
                <span className="px-3 py-1">...</span>
              )}

              {totalPages > 5 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`px-3 py-1 rounded-md ${
                    page === totalPages
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md ${
                  page === totalPages
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const price = product.discount_price || product.regular_price;
  const oldPrice = product.discount_price ? product.regular_price : null;
  const rating = Math.round(product.rating || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border rounded-md shadow hover:shadow-2xl hover:border-teal-300 transition duration-200 overflow-hidden"
    >
      <div className="relative">
        <Link to={`/products-collection/details/${product.slug}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-28  md:h-52 object-cover cursor-pointer"
            onError={(e) => (e.target.src = "/images/fallback.jpg")}
          />
        </Link>

        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {product.product_type}
        </span>
      </div>
      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <div className="text-yellow-500 text-sm mt-1">
          {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </div>
        <div className="mt-1 text-sm">
          <span className="text-green-600 font-semibold mr-2">৳{price}</span>
          {oldPrice && (
            <span className="line-through text-gray-400">৳{oldPrice}</span>
          )}
        </div>
        <Link
          to={`/products-collection/${product.slug}`}
          className="mt-2 block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-1 rounded"
        >
         Order Now
        </Link>
      </div>
    </motion.div>
  );
};

export default Shop;
