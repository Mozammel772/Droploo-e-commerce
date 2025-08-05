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
    refetch,
  } = useQuery({
    queryKey: ["topCategories"],
    queryFn: fetchCategories,
  });
  const handleCategoryClick = (slug) => {
    navigate(`/products-collection/${slug}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-2 md:py-5">
      <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-5">TOP CATEGORIES</h2>

      {isError && (
        <div className="min-h-[10vh] flex items-center justify-center px-4 py-6">
          <div className="bg-green-200 border border-gray-200  p-4 sm:p-6 rounded-xl text-center w-full max-w-xs md:max-w-md mx-auto">
            <AlertCircle
              size={32}
              className="text-red-600 mx-auto mb-3 sm:mb-4 sm:size-10"
            />
            <h2 className="text-lg sm:text-xl text-red-500 mb-2">
              Unable to Load Banner
            </h2>
            <p className="text-sm sm:text-base text-black mb-4 sm:mb-6 break-words">
              {String(isError)}
            </p>
            <button
              onClick={refetch}
              className="flex items-center justify-center gap-2 mx-auto px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <RefreshCw size={16} className="shrink-0" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-md shadow flex flex-col  gap-4 animate-pulse"
            >
              <div className="skeleton h-40 w-full rounded bg-gray-200"></div>
              <div className="skeleton h-4 w-1/2 mx-auto bg-gray-200"></div>
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 2.5, spaceBetween: 5 },
            640: { slidesPerView: 2.5, spaceBetween: 10 },
            768: { slidesPerView: 3.5, spaceBetween: 12 },
            1024: { slidesPerView: 4.5, spaceBetween: 16 },
            1280: { slidesPerView: 5.5, spaceBetween: 20 },
          }}
          modules={[Autoplay]}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <div
                onClick={() => handleCategoryClick(category.slug)}
                className="bg-white rounded-md shadow transition-all duration-300 cursor-pointer p-2 md:p-4 text-center border border-gray-200 hover:shadow-2xl hover:border-teal-600"
              >
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-24 md:h-40 object-contain mb-4 rounded"
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
