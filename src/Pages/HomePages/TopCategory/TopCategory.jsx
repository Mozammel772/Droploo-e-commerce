import { useQuery } from "@tanstack/react-query";
import { FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Fallback image UI
const ImageFallback = () => (
  <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-100 text-gray-500 mb-4 rounded text-sm">
    <FaImage className="text-2xl mb-1" />
    <span>Image not available</span>
  </div>
);

// ✅ Correct fetch function based on your API structure
const fetchCategories = async () => {
  const res = await fetch("https://backend.droploo.com/api/get/categories");

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const json = await res.json();
  console.log("Fetched categories response:", json);

  if (!json?.categories || !Array.isArray(json.categories)) {
    throw new Error("Invalid API response format");
  }

  return json.categories;
};

const TopCategories = () => {
  const navigate = useNavigate();
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["topCategories"],
    queryFn: fetchCategories,
  });
  const handleCategoryClick = (slug) => {
    navigate(`/products-collection/${slug}`);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">TOP CATEGORIES</h2>

      {isError && (
        <div className="text-red-500">
          Failed to load categories: {error.message}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-md shadow flex flex-col gap-4 animate-pulse"
            >
              <div className="skeleton h-40 w-full rounded bg-gray-200"></div>
              <div className="skeleton h-4 w-1/2 mx-auto bg-gray-200"></div>
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          spaceBetween={20}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1.5 },
            640: { slidesPerView: 2.5 },
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 4.5 },
            1280: { slidesPerView: 5.5 },
          }}
          modules={[Autoplay]}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <div
                onClick={() => handleCategoryClick(category.slug)}
                className="bg-white rounded-md shadow transition-all duration-300 cursor-pointer p-4 text-center border hover:shadow-2xl hover:border-teal-600"
              >
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-40 object-contain mb-4 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/fallback.jpg";
                    }}
                  />
                ) : (
                  <ImageFallback />
                )}
                <p className="font-medium">{category.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default TopCategories;
