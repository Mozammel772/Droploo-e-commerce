// import { FaTrash } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { useCart } from "../../Context/CartContext/CartContext";

// const CartDetails = () => {
//   const { cartItems, setCartItems } = useCart();

//   const handleQuantityChange = (index, value) => {
//     const updatedCart = [...cartItems];
//     updatedCart[index].quantity = parseInt(value) || 1;
//     setCartItems(updatedCart);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));
//   };

//   const deleteCartItem = (index) => {
//     const updatedCart = [...cartItems];
//     updatedCart.splice(index, 1);
//     setCartItems(updatedCart);
//     localStorage.setItem("cartItems", JSON.stringify(updatedCart));
//   };

//   const getTotalAmount = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   return (
//     <div className="p-4 md:p-10 max-w-[1400px] mx-auto">
//       <Link
//         to="/"
//         className="bg-teal-600 text-white px-4 py-2 rounded font-semibold hover:bg-teal-700"
//       >
//         Continue Shopping
//       </Link>

//       {cartItems.length === 0 ? (
//         <p className="mt-6 text-gray-600">Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto mt-6">
//             <table className="min-w-full ">
//               <thead className="bg-gray-100 text-left">
//                 <tr>
//                   <th className="p-3 border">Image</th>
//                   <th className="p-3 border">Product Name</th>
//                   <th className="p-3 border">Price</th>
//                   <th className="p-3 border">Quantity</th>
//                   <th className="p-3 border">Total</th>
//                   <th className="p-3 border">Remove</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map((item, i) => (
//                   <tr key={i} className="text-center border-b">
//                     <td className="p-3 border">
//                       <img
//                         src={item.imageUrl}
//                         alt={item.name}
//                         className="w-20 h-20 object-cover rounded"
//                       />
//                     </td>
//                     <td className="p-3 border font-semibold">{item.name}</td>
//                     <td className="p-3 border">৳{item.price}</td>
//                     <td className="p-3 border">
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         min={1}
//                         onChange={(e) =>
//                           handleQuantityChange(i, e.target.value)
//                         }
//                         className="w-16 px-2 py-1 border rounded text-center"
//                       />
//                     </td>
//                     <td className="p-3 border font-bold text-teal-700">
//                       ৳{item.price * item.quantity}
//                     </td>
//                     <td className="p-3 border">
//                       <button
//                         className="text-red-500 hover:text-red-700"
//                         onClick={() => deleteCartItem(i)}
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Total & Checkout */}
//           <div className="mt-6 flex justify-center">
//             <div className="text-center">
//               <p className="text-xl font-semibold mb-4">
//                 Grand Total: ৳{getTotalAmount()}
//               </p>
//               <Link to="/checkout" className="block">
//                 <button className="bg-teal-700 text-white px-6 py-2 rounded font-semibold hover:bg-teal-800 w-full">
//                   Proceed to Checkout
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartDetails;

import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext/CartContext";

const CartDetails = () => {
  const { cartItems, setCartItems } = useCart();

  // Helper function to safely get display value
  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cartItems];
    const quantity = parseInt(value) || 1;
    
    if (isNaN(quantity)) return;
    
    updatedCart[index].quantity = quantity;
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const deleteCartItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  };

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto">
      <Link
        to="/"
        className="bg-teal-600 text-white px-4 py-2 rounded font-semibold hover:bg-teal-700 inline-block mb-6"
      >
        Continue Shopping
      </Link>

      {cartItems.length === 0 ? (
        <p className="mt-6 text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-6">
            {/* Desktop Headers (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-100 p-3 rounded-lg">
              <div className="col-span-4 font-medium">Product</div>
              <div className="col-span-2 font-medium text-center">Price</div>
              <div className="col-span-2 font-medium text-center">Quantity</div>
              <div className="col-span-2 font-medium text-center">Total</div>
              <div className="col-span-2 font-medium text-center">Action</div>
            </div>

            {cartItems.map((item, i) => {
              if (!item || typeof item !== "object") {
                console.error("Invalid cart item:", item);
                return null;
              }

              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const total = price * quantity;

              return (
                <div
                  key={i}
                  className="bg-white grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border border-gray-300 rounded-lg shadow-sm"
                >
                  {/* Product Image and Name */}
                  <div className="md:col-span-4 flex items-center space-x-4">
                    <img
                      src={getDisplayValue(item.imageUrl)}
                      alt={getDisplayValue(item.name)}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                    <h3 className="font-semibold text-sm md:text-base">
                      {getDisplayValue(item.name) || "Unnamed Product"}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 flex justify-between md:block">
                    <span className="md:hidden font-medium">Price: </span>
                    <span>৳{price.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-between md:block">
                    <span className="md:hidden font-medium">Quantity: </span>
                    <input
                      type="number"
                      value={quantity}
                      min={1}
                      onChange={(e) => handleQuantityChange(i, e.target.value)}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 flex justify-between md:block">
                    <span className="md:hidden font-medium">Total: </span>
                    <span className="font-bold text-teal-700">
                      ৳{total.toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      className="text-red-500 hover:text-red-700 p-2"
                      onClick={() => deleteCartItem(i)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total & Checkout */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Grand Total:</h3>
              <span className="text-xl font-bold text-teal-700">
                ৳{getTotalAmount().toFixed(2)}
              </span>
            </div>
            <Link to="/checkout" className="block">
              <button className="bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 w-full transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDetails;