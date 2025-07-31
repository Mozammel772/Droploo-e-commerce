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
      <p className="text-center text-red-500 py-10">Failed to load banners</p>
    );

  return (
    <div className="max-w-7xl mx-auto relative">
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
                className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}

          {/* ⏱ Countdown Timer in Bottom Right */}
          <div className="absolute right-5 bottom-14 bg-indigo-900 bg-opacity-100 text-white text-base p-3 px-4 rounded-full z-10">
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
          .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #9ca3af;
            opacity: 1;
            transition: background 0.3s;
          }
          .swiper-pagination-bullet-active {
            background: #3b82f6;
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
