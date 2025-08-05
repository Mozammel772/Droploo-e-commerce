import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// 🔹 fetch function using native fetch
const fetchBanners = async () => {
  const res = await fetch("https://backend.droploo.com/api/home-sliders");
  const data = await res.json();
  return data.data; // returning array of banners
};

const Banner = () => {
  const {
    data: banners = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["homeBanners"],
    queryFn: fetchBanners,
  });

  const [secondsLeft, setSecondsLeft] = useState(3);
  const intervalRef = useRef(null);

  // ⏱ Reset countdown on slide change
  const resetCountdown = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(3);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    resetCountdown();
    return () => clearInterval(intervalRef.current);
  }, []);

  if (isError)
    return (
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
    );

  return (
    <div className="max-w-[1400px] mx-auto relative p-2">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(1)].map((_, i) => (
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
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          onSlideChange={resetCountdown}
          modules={[Navigation, Pagination, Autoplay]}
          className="rounded-lg"
        >
          {banners.map((banner, i) => (
            <SwiperSlide key={banner.id}>
              <img
                src={banner.imageUrl}
                alt={`Banner ${i + 1}`}
                className="w-full h-[200px] md:h-[300px] lg:h-[400px]  rounded-lg"
              />
            </SwiperSlide>
          ))}

          {/* ⏱ Countdown Timer in Bottom Right */}
          <div className="absolute right-5 bottom-14 bg-teal-700 bg-opacity-100 text-white text-base p-0.5 px-1.5 md:p-1 md:px-2 rounded-full z-10">
            {secondsLeft}s
          </div>
        </Swiper>
      )}

      {/* 🟣 Custom Swiper Pagination Style */}
      <style>
        {`
    .swiper-pagination {
      margin-top: 20px;
      position: static !important;
      text-align: center;
    }

    /* 🔹 Default (Mobile First) */
    .swiper-pagination-bullet {
      width: 6px;
      height: 6px;
      background: #9ca3af;
      opacity: 1;
      transition: background 0.3s;
    }
    .swiper-pagination-bullet-active {
      background: #3b82f6;
    }

    /* 🔹 Arrows - Mobile default (smaller) */
    .swiper-button-prev,
    .swiper-button-next {
      width: 25px;
      height: 25px;
    }
    .swiper-button-prev::after,
    .swiper-button-next::after {
      font-size: 16px;
    }

    /* 🔹 Desktop - Larger */
    @media (min-width: 768px) {
      .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
      }

      .swiper-button-prev,
      .swiper-button-next {
        width: 44px;
        height: 44px;
      }
      .swiper-button-prev::after,
      .swiper-button-next::after {
        font-size: 22px;
      }
    }
  `}
      </style>
    </div>
  );
};

export default Banner;
