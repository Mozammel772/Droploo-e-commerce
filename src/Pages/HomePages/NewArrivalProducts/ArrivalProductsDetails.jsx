
// import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";
// import { useParams } from "react-router-dom";

// const fetchProductBySlug = async (slug) => {
//   const res = await fetch(`https://backend.droploo.com/api/new-arrival/products/list/${slug}`);
  
//   if (!res.ok) throw new Error("Product not found");
//   return res.json();
// };

// const ArrivalProductsDetails = () => {
//   const { slug } = useParams(); // 🟢 taking slug from URL
// console.log("slug", slug,error)
//   const { data: product, isLoading, error } = useQuery({
//     queryKey: ["product", slug],
//     queryFn: () => fetchProductBySlug(slug),
//   });

//   const [mainImage, setMainImage] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (product?.imageUrl) {
//       setMainImage(product.imageUrl);
//     }
//   }, [product]);

//   const handleQuantityChange = (amount) => {
//     setQuantity((prev) => {
//       const newQty = prev + amount;
//       if (newQty < 1) return 1;
//       if (newQty > product.qty) return product.qty;
//       return newQty;
//     });
//   };

//   if (isLoading) return <p className="p-10 text-center">Loading...</p>;
//   if (error) return <p className="p-10 text-center">Failed to load product.</p>;

//   return (
//     <div className="max-w-[1400px] mx-auto p-4 md:p-10">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Image */}
//         <div className="md:w-1/2 space-y-4">
//           <img
//             src={mainImage}
//             alt={product.name}
//             className="w-full rounded-md object-cover shadow"
//             onError={(e) => (e.target.src = "/images/fallback.jpg")}
//           />
//         </div>

//         {/* Details */}
//         <div className="md:w-1/2 space-y-4">
//           <h1 className="text-3xl font-bold">{product.name}</h1>

//           <div className="flex items-center text-yellow-500">
//             Rating: {product.rating}
//             <div className="flex ml-2">
//               {[...Array(Math.floor(product.rating))].map((_, i) => (
//                 <FaStar key={i} className="text-yellow-400" />
//               ))}
//             </div>
//           </div>

//           <div className="text-2xl font-bold text-green-700">
//             ৳{product.discount_price}
//           </div>
//           <p className="text-gray-400 line-through">৳{product.regular_price}</p>

//           {product.qty > 0 ? (
//             <>
//               <p className="text-gray-700 font-semibold">
//                 In Stock: <span className="text-green-600">{product.qty}</span>
//               </p>

//               <div className="flex items-center gap-2 mt-2">
//                 <span className="font-semibold">Quantity:</span>
//                 <button
//                   onClick={() => handleQuantityChange(-1)}
//                   className="w-8 h-8 bg-gray-200 rounded"
//                 >
//                   –
//                 </button>
//                 <span>{quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange(1)}
//                   className="w-8 h-8 bg-gray-200 rounded"
//                 >
//                   +
//                 </button>
//               </div>

//               <div className="flex gap-4 mt-4">
//                 <button
//                   onClick={() => alert(`Added ${quantity} items to cart.`)}
//                   className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded font-semibold"
//                 >
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={() => alert(`Purchased ${quantity} items.`)}
//                   className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-semibold"
//                 >
//                   Purchase
//                 </button>
//               </div>
//             </>
//           ) : (
//             <button
//               disabled
//               className="w-full mt-4 bg-gray-400 text-white py-3 rounded font-semibold cursor-not-allowed"
//             >
//               Stock Out
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Description */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-2">Description</h2>
//         <div
//           className="prose max-w-none"
//           dangerouslySetInnerHTML={{ __html: product.long_description }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ArrivalProductsDetails;


import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const fetchProductBySlug = async (slug) => {
  const res = await fetch(`https://backend.droploo.com/api/new-arrival/products/${slug}`);
  
  if (!res.ok) throw new Error("Product not found");
  const data = await res.json();
  return data.product || data; // API রেস্পন্স অনুযায়ী এডজাস্ট করুন
};

const ArrivalProductsDetails = () => {
  const { slug } = useParams();
  console.log("slug ", slug.error);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  useEffect(() => {
    if (product?.imageUrl) {
      setMainImage(product.imageUrl);
    }
  }, [product]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQty = prev + amount;
      if (newQty < 1) return 1;
      if (newQty > (product?.qty || 10)) return product.qty;
      return newQty;
    });
  };

  if (isLoading) return (
    <div className="max-w-[1400px] mx-auto p-10">
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        <div className="md:w-1/2 h-96 bg-gray-200 rounded"></div>
        <div className="md:w-1/2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-[1400px] mx-auto p-10 text-center">
      <p className="text-red-500 mb-4">Product not found</p>
      <Link 
        to="/products" 
        className="inline-flex items-center text-teal-600 hover:text-teal-800"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10">
      <Link 
        to="/products" 
        className="inline-flex items-center mb-6 text-teal-600 hover:text-teal-800"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={mainImage}
            alt={product?.name}
            className="w-full rounded-md object-cover shadow-lg"
            onError={(e) => (e.target.src = "/images/fallback.jpg")}
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product?.name}</h1>

          <div className="flex items-center">
            <div className="flex text-yellow-500 mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-gray-600">({product.rating})</span>
          </div>

          <div className="text-2xl font-bold text-green-700">
            ৳{product.discount_price || product.regular_price}
          </div>
          
          {product.discount_price && (
            <p className="text-gray-400 line-through">৳{product.regular_price}</p>
          )}

          {product.qty > 0 ? (
            <>
              <p className="text-gray-700">
                <span className="font-semibold">Availability:</span> 
                <span className="text-green-600 ml-2">In Stock ({product.qty})</span>
              </p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => alert(`Added ${quantity} ${product.name} to cart`)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </>
          ) : (
            <button
              disabled
              className="w-full mt-4 bg-gray-400 text-white py-3 rounded font-semibold cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}

          <div className="pt-4 border-t mt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.short_description}</p>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="mt-12 pt-6 border-t">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.long_description }} 
        />
      </div>
    </div>
  );
};

export default ArrivalProductsDetails;