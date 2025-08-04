import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../Context/CartContext/CartContext";

const fetchProductDetails = async (slug) => {
  const res = await fetch(
    `https://backend.droploo.com/api/product/details/${slug}`
  );
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
};

const ShopDetails = () => {
  const { slug } = useParams();
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("PRODUCT DETAILS");
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["product-details", slug],
    queryFn: () => fetchProductDetails(slug),
    enabled: !!slug,
  });
  console.log("cuee", data);

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 animate-pulse space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 space-y-4">
            <div className="h-96 bg-gray-200 rounded-md" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 w-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        পণ্য লোড ব্যর্থ হয়েছে।
      </div>
    );

  const product = data?.data?.product;
  const related = data?.data?.related || [];

  const mainDisplayImage = mainImage || product?.imageUrl;
  const price = product.discount_price || product.regular_price;

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, Number(prev) + change));
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price,
      quantity: Number(quantity),
      selectedColor,
      selectedSize,
      imageUrl: product.imageUrl,
    });
  };

  const handleOrderNow = () => {
    const orderData = {
      id: product.id,
      name: product.name,
      price,
      quantity: Number(quantity),
      selectedColor,
      selectedSize,
      imageUrl: product.imageUrl,
    };

    navigate("/checkout", { state: orderData });
  };

  const TABS = [
    "PRODUCT DETAILS",
    "RETURN POLICY",
    "REVIEW",
    "VIDEO",
    "TERMS & CONDITIONS",
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-2">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery */}
        <div className="md:w-1/2 space-y-4">
          <div className=" group overflow-hidden">
            <InnerImageZoom
              src={mainDisplayImage}
              zoomSrc={mainDisplayImage}
              zoomType="hover"
              zoomScale={1.5}
              zoomPreload={true}
              zoomPosition="original"
              alt={product?.name}
              className="w-full  rounded-md object-contain "
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {product?.product_images?.length > 0 ? (
              product.product_images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.imageUrl}
                  alt={`thumbnail-${idx}`}
                  onClick={() => setMainImage(img.imageUrl)}
                  className={`h-20 w-20 object-cover border rounded cursor-pointer transition transform hover:scale-105 ${
                    mainImage === img.imageUrl
                      ? "border-teal-600 scale-110"
                      : ""
                  }`}
                />
              ))
            ) : (
              <img
                src={product?.imageUrl}
                alt="Main Image"
                className="h-12 w-12 object-cover border rounded"
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-xl md:text-3xl font-bold">{product.name}</h1>
          <p className=" text-lg">
            Brand:{" "}
            <span className="font-semibold">{product.brand_id || "N/A"}</span>
          </p>
          <p className=" text-lg">
            Category:{" "}
            <span className="font-semibold">
              {product.category?.name || "N/A"}
            </span>
          </p>

          <div className="flex items-center ">
            Ratting: {product.rating || 0}
            <div className="flex ml-2 text-xl">
              {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
          </div>
          {product.colors?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Available Colors:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
                      selectedColor === color.name
                        ? "border-teal-600 bg-teal-100"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: color.code || color.hex || "transparent",
                    }}
                    title={color.name || "Color"}
                    type="button"
                  >
                    {color.name || ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1 mt-4">
                Available Sizes:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size.name || size.size)}
                    className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
                      selectedSize === (size.name || size.size)
                        ? "border-teal-600 bg-teal-100"
                        : "border-gray-300 bg-gray-100"
                    }`}
                    title={size.name || size.size || "Size"}
                    type="button"
                  >
                    {size.name || size.size || ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-2xl font-bold text-green-700">৳ {price}</div>
          {product.discount_price && (
            <p className="text-gray-400 line-through text-sm">
              Price: ৳ {product.regular_price}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold">Quantity:</span>
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
            >
              –
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded font-semibold transition"
            >
              Add to Card
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-semibold transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
      {/* === Tab Navigation Section === */}
      <div className="mt-12">
        <div className="border-b overflow-x-auto no-scrollbar">
          <div className="flex gap-6 text-sm font-semibold text-gray-600 min-w-max">
            {TABS.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`py-2 whitespace-nowrap border-b-2 transition ${
                  activeTab === tabName
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent hover:text-teal-600"
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          <TabContent tab={activeTab} product={product} />
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.map((item) => (
              <div
                key={item.id}
                className="border rounded p-2 bg-white shadow hover:shadow-md"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-sm font-medium mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-teal-600 font-semibold text-sm mb-2">
                  ৳ {item.regular_price}
                </p>
                <Link
                  to={`/products-collection/details/${item.slug}`}
                  className="block text-center bg-teal-600 text-white text-sm py-1 rounded hover:bg-teal-700"
                >
                  বিস্তারিত দেখুন
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TabContent = ({ tab, product }) => {
  switch (tab) {
    case "PRODUCT DETAILS":
      return product?.long_description ? (
        <div
          className="prose max-w-none mt-4"
          dangerouslySetInnerHTML={{ __html: product.long_description }}
        />
      ) : (
        <p className="text-gray-500">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
      );
    case "RETURN POLICY":
      return product?.policy ? (
        <div className=" text-gray-800  p-4  text-sm leading-relaxed space-y-2">
          {/* Render dynamic HTML policy */}
          <div
            className="[&>p]:mb-2 [&>p]:text-gray-700 [&>a]:text-blue-600 [&>a:hover]:underline"
            dangerouslySetInnerHTML={{ __html: product?.policy }}
          />
        </div>
      ) : (
        <p className="text-gray-500">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
      );
    case "REVIEW":
      return product?.review?.length ? (
        <div className="text-gray-800 p-4 text-sm leading-relaxed space-y-2">
          {product.review.map((item, index) => (
            <div
              key={index}
              className="[&>p]:mb-2 [&>p]:text-gray-700 [&>a]:text-blue-600 [&>a:hover]:underline"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
      );

    case "VIDEO":
      return product?.video ? (
        <div className="mt-4">
          <iframe
            width="100%"
            height="400"
            src={product.video}
            title="Product Video"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      ) : (
        <p className="text-sm text-gray-600">ভিডিও পাওয়া যায়নি।</p>
      );
    case "TERMS & CONDITIONS":
      return (
        <p className="text-sm text-gray-600">
          সকল পণ্য কোম্পানির নির্ধারিত নীতিমালার ভিত্তিতে সরবরাহ করা হয়।
          বিস্তারিত শর্তাবলি প্রযোজ্য।
        </p>
      );
    default:
      return null;
  }
};

export default ShopDetails;
// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import { FaStar } from "react-icons/fa";
// import InnerImageZoom from "react-inner-image-zoom";
// import "react-inner-image-zoom/lib/styles.min.css";
// import { Link, useParams } from "react-router-dom";

// const fetchProductDetails = async (slug) => {
//   const res = await fetch(
//     `https://backend.droploo.com/api/product/details/${slug}`
//   );
//   if (!res.ok) throw new Error("Failed to load product");
//   return res.json();
// };

// const ShopDetails = () => {
//   const { slug } = useParams();
//   const [mainImage, setMainImage] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("PRODUCT DETAILS");
//   const [cart, setCart] = useState(null);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["product-details", slug],
//     queryFn: () => fetchProductDetails(slug),
//     enabled: !!slug,
//   });
//   console.log("cuee", data);

//   if (isLoading) {
//     return (
//       <div className="max-w-[1400px] mx-auto p-4 animate-pulse space-y-6">
//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="md:w-1/2 space-y-4">
//             <div className="h-96 bg-gray-200 rounded-md" />
//             <div className="flex gap-2">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="h-20 w-20 bg-gray-200 rounded" />
//               ))}
//             </div>
//           </div>
//           <div className="md:w-1/2 space-y-4">
//             <div className="h-8 w-3/4 bg-gray-200 rounded" />
//             <div className="h-6 w-1/2 bg-gray-200 rounded" />
//             <div className="h-6 w-1/3 bg-gray-200 rounded" />
//             <div className="h-6 w-24 bg-gray-200 rounded" />
//             <div className="h-8 w-full bg-gray-200 rounded" />
//             <div className="h-8 w-full bg-gray-200 rounded" />
//           </div>
//         </div>
//       </div>
//     );
//   }
//   if (error)
//     return (
//       <div className="p-10 text-center text-red-500">
//         পণ্য লোড ব্যর্থ হয়েছে।
//       </div>
//     );

//   const product = data?.data?.product;
//   const related = data?.data?.related || [];

//   const mainDisplayImage = mainImage || product?.imageUrl;
//   const price = product.discount_price || product.regular_price;

//   const handleQuantityChange = (change) => {
//     setQuantity((prev) => Math.max(1, prev + change));
//   };
//   const handleAddToCart = () => {
//     setCart({
//       id: product.id,
//       name: product.name,
//       price,
//       quantity,
//       colors: product.colors,
//       sizes: product.sizes,
//       imageUrl: product.imageUrl,
//     });
//     alert(`${quantity} item(s) added to cart.`);
//   };

//   const handleOrderNow = () => {
//     if (!cart) {
//       // If cart empty, add current product first
//       handleAddToCart();
//     }

//   };

//   const TABS = [
//     "PRODUCT DETAILS",
//     "RETURN POLICY",
//     "REVIEW",
//     "VIDEO",
//     "TERMS & CONDITIONS",
//   ];

//   return (
//     <div className="max-w-[1400px] mx-auto p-4">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Image Gallery */}
//         <div className="md:w-1/2 space-y-4">
//           <div className=" group overflow-hidden">
//             <InnerImageZoom
//               src={mainDisplayImage}
//               zoomSrc={mainDisplayImage}
//               zoomType="hover"
//               zoomScale={1.5}
//               zoomPreload={true}
//               zoomPosition="original" // <- this is key
//               alt={product?.name}
//               className="w-full rounded-md object-contain"
//             />
//           </div>
//           <div className="flex gap-2 overflow-x-auto scrollbar-hide">
//             {product?.product_images?.length > 0 ? (
//               product.product_images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img.imageUrl}
//                   alt={`thumbnail-${idx}`}
//                   onClick={() => setMainImage(img.imageUrl)}
//                   className={`h-20 w-20 object-cover border rounded cursor-pointer transition transform hover:scale-105 ${
//                     mainImage === img.imageUrl
//                       ? "border-teal-600 scale-110"
//                       : ""
//                   }`}
//                 />
//               ))
//             ) : (
//               <img
//                 src={product?.imageUrl}
//                 alt="Main Image"
//                 className="h-20 w-20 object-cover border rounded"
//               />
//             )}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="md:w-1/2 space-y-4">
//           <h1 className="text-xl md:text-3xl font-bold">{product.name}</h1>
//           <p className=" text-lg">
//             Brand:{" "}
//             <span className="font-semibold">{product.brand_id || "N/A"}</span>
//           </p>
//           <p className=" text-lg">
//             Category:{" "}
//             <span className="font-semibold">
//               {product.category?.name || "N/A"}
//             </span>
//           </p>

//           <div className="flex items-center ">
//             Ratting: {product.rating || 0}
//             <div className="flex ml-2 text-xl">
//               {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
//                 <FaStar key={i} className="text-yellow-400" />
//               ))}
//             </div>
//           </div>
//           {/* Colors */}
//           {product.colors?.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-1">
//                 Available Colors:
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.colors.map((color, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-800 text-sm cursor-default"
//                     style={{
//                       backgroundColor: color.code || color.hex || "transparent",
//                     }}
//                     title={color.name || "Color"}
//                   >
//                     {color.name || ""}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Sizes */}
//           {product.sizes?.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold text-gray-700 mb-1 mt-4">
//                 Available Sizes:
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.sizes.map((size, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-800 text-sm cursor-default"
//                     title={size.name || size.size || "Size"}
//                   >
//                     {size.name || size.size || ""}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//           <div className="text-2xl font-bold text-green-700">৳ {price}</div>
//           {product.discount_price && (
//             <p className="text-gray-400 line-through text-sm">
//               Price: ৳ {product.regular_price}
//             </p>
//           )}

//           <div className="mt-2 flex items-center gap-2">
//             <span className="font-semibold">Quantity:</span>
//             <button
//               onClick={() => handleQuantityChange(-1)}
//               className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               –
//             </button>
//             <span className="w-8 text-center">{quantity}</span>
//             <button
//               onClick={() => handleQuantityChange(1)}
//               className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               +
//             </button>
//           </div>

//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={handleAddToCart}
//               className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded font-semibold transition"
//             >
//               Add to Card
//             </button>
//             <button
//               onClick={handleOrderNow}
//               className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded font-semibold transition"
//             >
//               Order Now
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* === Tab Navigation Section === */}
//       <div className="mt-12">
//         <div className="border-b overflow-x-auto no-scrollbar">
//           <div className="flex gap-6 text-sm font-semibold text-gray-600 min-w-max">
//             {TABS.map((tabName) => (
//               <button
//                 key={tabName}
//                 onClick={() => setActiveTab(tabName)}
//                 className={`py-2 whitespace-nowrap border-b-2 transition ${
//                   activeTab === tabName
//                     ? "border-teal-500 text-teal-600"
//                     : "border-transparent hover:text-teal-600"
//                 }`}
//               >
//                 {tabName}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="mt-4">
//           <TabContent tab={activeTab} product={product} />
//         </div>
//       </div>

//       {/* Related Products */}
//       {related.length > 0 && (
//         <div className="mt-12">
//           <h2 className="text-xl font-semibold mb-4">Related Products</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {related.map((item) => (
//               <div
//                 key={item.id}
//                 className="border rounded p-2 bg-white shadow hover:shadow-md"
//               >
//                 <img
//                   src={item.imageUrl}
//                   alt={item.name}
//                   className="w-full h-40 object-cover rounded mb-2"
//                 />
//                 <h3 className="text-sm font-medium mb-1 line-clamp-2">
//                   {item.name}
//                 </h3>
//                 <p className="text-teal-600 font-semibold text-sm mb-2">
//                   ৳ {item.regular_price}
//                 </p>
//                 <Link
//                   to={`/products-collection/details/${item.slug}`}
//                   className="block text-center bg-teal-600 text-white text-sm py-1 rounded hover:bg-teal-700"
//                 >
//                   বিস্তারিত দেখুন
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const TabContent = ({ tab, product }) => {
//   switch (tab) {
//     case "PRODUCT DETAILS":
//       return product?.long_description ? (
//         <div
//           className="prose max-w-none mt-4"
//           dangerouslySetInnerHTML={{ __html: product.long_description }}
//         />
//       ) : (
//         <p className="text-gray-500">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
//       );
//     case "RETURN POLICY":
//       return product?.policy ? (
//         <div className=" text-gray-800  p-4  text-sm leading-relaxed space-y-2">
//           {/* Render dynamic HTML policy */}
//           <div
//             className="[&>p]:mb-2 [&>p]:text-gray-700 [&>a]:text-blue-600 [&>a:hover]:underline"
//             dangerouslySetInnerHTML={{ __html: product?.policy }}
//           />
//         </div>
//       ) : (
//         <p className="text-gray-500">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
//       );
//     case "REVIEW":
//       return product?.review?.length ? (
//         <div className="text-gray-800 p-4 text-sm leading-relaxed space-y-2">
//           {product.review.map((item, index) => (
//             <div
//               key={index}
//               className="[&>p]:mb-2 [&>p]:text-gray-700 [&>a]:text-blue-600 [&>a:hover]:underline"
//               dangerouslySetInnerHTML={{ __html: item }}
//             />
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
//       );

//     case "VIDEO":
//       return product?.video ? (
//         <div className="mt-4">
//           <iframe
//             width="100%"
//             height="400"
//             src={product.video}
//             title="Product Video"
//             allowFullScreen
//             className="rounded-lg"
//           ></iframe>
//         </div>
//       ) : (
//         <p className="text-sm text-gray-600">ভিডিও পাওয়া যায়নি।</p>
//       );
//     case "TERMS & CONDITIONS":
//       return (
//         <p className="text-sm text-gray-600">
//           সকল পণ্য কোম্পানির নির্ধারিত নীতিমালার ভিত্তিতে সরবরাহ করা হয়।
//           বিস্তারিত শর্তাবলি প্রযোজ্য।
//         </p>
//       );
//     default:
//       return null;
//   }
// };

// export default ShopDetails;
