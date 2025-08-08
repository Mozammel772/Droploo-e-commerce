import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../../Context/CartContext/CartContext";

const fetchProducts = async () => {
  const res = await fetch(
    "https://backend.droploo.com/api/feature/products/list"
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products || [];
};

const FeatureProductCard = ({ product, addToCart, cartItems }) => {
  const price = product.discount_price || product.regular_price;
  const oldPrice = product.discount_price ? product.regular_price : null;
  const rating = Math.round(product.rating || 0);

  const handleAddToCart = () => {
    const selectedColor = product.colors?.[0] || null;
    const selectedSize = product.sizes?.[0] || null;

    const isAlreadyInCart = cartItems.some(
      (item) =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (!isAlreadyInCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price,
        quantity: 1,
        selectedColor,
        selectedSize,
        imageUrl: product.imageUrl,
      });
      toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.warning(`${product.name} ইতিমধ্যেই কার্টে আছে!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow hover:shadow-2xl hover:border-teal-300 transition duration-200 overflow-hidden">
      <div className="relative">
        <Link to={`/new-feature/product/${product.slug}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-28 md:h-52 object-cover cursor-pointer"
            onError={(e) => (e.target.src = "/images/fallback.jpg")}
          />
        </Link>

        <span className="absolute top-2 right-2 bg-orange-700 text-white text-[12px] px-[6px] py-[2px] md:px-2 md:py-1 rounded-full">
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
        <button
          onClick={handleAddToCart}
          className="mt-2 block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-1 rounded transition-colors duration-200"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

const FeatureProducts = () => {
  const { addToCart, cartItems } = useCart();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchProducts,
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 uppercase">Feature Products</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 border rounded-md shadow p-3 animate-pulse"
            >
              <div className="skeleton h-52 w-full rounded"></div>
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-4 w-2/3"></div>
              <div className="skeleton h-8 w-full rounded"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load products.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {products.map((item) => (
            <FeatureProductCard
              key={item.id}
              product={item}
              addToCart={addToCart}
              cartItems={cartItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureProducts;
