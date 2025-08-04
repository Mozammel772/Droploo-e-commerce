// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";

// const fetchProducts = async () => {
//   const res = await fetch(
//     "https://backend.droploo.com/api/discount/products/list"
//   );
//   if (!res.ok) throw new Error("Failed to fetch products");
//   const data = await res.json();
//   return data.products || [];
// };

// const DiscountProducts = () => {
//   const {
//     data: products = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["allProducts"],
//     queryFn: fetchProducts,
//   });

//   return (
//     <div className="max-w-[1400px] mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6 uppercase">Discount Products</h1>

//       {isLoading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, i) => (
//             <div
//               key={i}
//               className="flex flex-col gap-4 border rounded-md shadow p-3 animate-pulse"
//             >
//               <div className="skeleton h-52 w-full rounded"></div>
//               <div className="skeleton h-4 w-1/2"></div>
//               <div className="skeleton h-4 w-2/3"></div>
//               <div className="skeleton h-8 w-full rounded"></div>
//             </div>
//           ))}
//         </div>
//       ) : isError ? (
//         <p className="text-center text-red-500">Failed to load products.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((item) => (
//             <ProductCard key={item.id} product={item} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const ProductCard = ({ product }) => {
//   const price = product.discount_price || product.regular_price;
//   const oldPrice = product.discount_price ? product.regular_price : null;
//   const rating = Math.round(product.rating || 0);
//   const isNewArrival = rating >= 4.5;

//   console.log("product data", product.slug);
//   return (
//     <div className="bg-white border rounded-md shadow hover:shadow-2xl hover:border-teal-300 transition duration-200 overflow-hidden">
//       <div className="relative">
//         <Link to={`/new-arrival/product/${product.slug}`}>
//           <img
//             src={product.imageUrl}
//             alt={product.name}
//             className="w-full h-52 object-cover cursor-pointer"
//             onError={(e) => (e.target.src = "/images/fallback.jpg")}
//           />
//         </Link>
//         {isNewArrival && (
//           <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
//             New
//           </span>
//         )}
//       </div>
//       <div className="p-3">
//         <h2 className="text-sm font-semibold text-gray-800 truncate">
//           {product.name}
//         </h2>
//         <div className="text-yellow-500 text-sm mt-1">
//           {"★".repeat(rating) + "☆".repeat(5 - rating)}
//         </div>
//         <div className="mt-1 text-sm">
//           <span className="text-green-600 font-semibold mr-2">৳{price}</span>
//           {oldPrice && (
//             <span className="line-through text-gray-400">৳{oldPrice}</span>
//           )}
//         </div>
//         <Link
//           to={`/product/${product.slug}`}
//           className="mt-2 block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-1 rounded"
//         >
//           VIEW DETAILS
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default DiscountProducts;



import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Fetch function
const fetchProducts = async () => {
  const res = await fetch("https://backend.droploo.com/api/new-arrival/products/list");

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  console.log("Fetched API data:", data);

  // Ensure it's a valid array
  if (!Array.isArray(data.products)) {
    throw new Error("Invalid product format");
  }

  return data.products;
};

// Product Card Component
const ProductCard = ({ product }) => {
  const price = product.discount_price || product.regular_price;
  const oldPrice = product.discount_price ? product.regular_price : null;
  const rating = Math.round(product.rating || 0);

console.log("prodycs" ,product)
  return (
    <div className="bg-white border rounded-md shadow hover:shadow-2xl hover:border-teal-300 transition duration-200 overflow-hidden">
      <div className="relative">
        <Link to={`/new-arrival/product/${product.slug}`}>
          <img
            src={product.imageUrl || "/images/fallback.jpg"}
            alt={product.name}
            className="w-full h-52 object-cover cursor-pointer"
            onError={(e) => (e.target.src = "/images/fallback.jpg")}
          />
        </Link>
       <div className="flex justify-between">
         <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {product.product_code}
          </span>
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {product.product_type}
          </span>
       </div>
         
     
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
          to={`/product/${product.slug}`}
          className="mt-2 block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-1 rounded"
        >
          VIEW DETAILS
        </Link>
      </div>
    </div>
  );
};

// Main Discount Products Component
const DiscountProducts = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchProducts,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 uppercase">Discount Products</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 border rounded-md shadow p-3 animate-pulse"
            >
              <div className="skeleton h-52 w-full rounded bg-gray-200"></div>
              <div className="skeleton h-4 w-1/2 bg-gray-200"></div>
              <div className="skeleton h-4 w-2/3 bg-gray-200"></div>
              <div className="skeleton h-8 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          Failed to load products.
          <br />
          <small>{error?.message}</small>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountProducts;
