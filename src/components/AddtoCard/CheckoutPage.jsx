// import { useState } from "react";
// import { useCart } from "../../Context/CartContext/CartContext";

// const CheckoutPage = () => {
//   const { cartItems } = useCart();
//   const [deliveryCharge, setDeliveryCharge] = useState(60); // Default: Inside Dhaka
//   const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

//   const getTotalAmount = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Left - Shipping Info */}
//       <div className="md:col-span-2 bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input type="text" placeholder="Full Name" className="border p-2 rounded w-full" />
//           <input type="text" placeholder="Phone Number" className="border p-2 rounded w-full" />
//           <input type="text" placeholder="Email Address" className="border p-2 rounded w-full" />
//           <input type="text" placeholder="City" className="border p-2 rounded w-full" />
//           <input type="text" placeholder="Zip Code" className="border p-2 rounded w-full" />
//           <input type="text" placeholder="Full Address" className="border p-2 rounded w-full md:col-span-2" />
//         </div>

//         {/* Delivery Area */}
//         <div className="mt-6 space-y-2">
//           <p className="font-semibold">Delivery Area</p>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="deliveryCharge"
//               value="60"
//               checked={deliveryCharge === 60}
//               onChange={() => setDeliveryCharge(60)}
//             />
//             Inside Dhaka (৳60)
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="deliveryCharge"
//               value="120"
//               checked={deliveryCharge === 120}
//               onChange={() => setDeliveryCharge(120)}
//             />
//             Outside Dhaka (৳120)
//           </label>
//         </div>

//         {/* Payment Method */}
//         <div className="mt-6 space-y-2">
//           <p className="font-semibold">Payment Method</p>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="Cash On Delivery"
//               checked={paymentMethod === "Cash On Delivery"}
//               onChange={() => setPaymentMethod("Cash On Delivery")}
//             />
//             Cash On Delivery
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="SSLCommerz"
//               checked={paymentMethod === "SSLCommerz"}
//               onChange={() => setPaymentMethod("SSLCommerz")}
//             />
//             Pay with SSLCommerz
//           </label>
//         </div>
//       </div>

//       {/* Right - Summary */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//         <div className="space-y-4 border-b pb-4">
//           {cartItems.map((item, index) => (
//             <div key={index} className="flex justify-between items-center text-sm">
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-gray-600">Qty: {item.quantity}</p>
//               </div>
//               <p className="text-green-700 font-semibold">
//                 ৳{item.price * item.quantity}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Total Calculation */}
//         <div className="mt-4 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>৳{getTotalAmount()}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Charge</span>
//             <span>৳{deliveryCharge}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Payment Method</span>
//             <span>{paymentMethod}</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg">
//             <span>Total</span>
//             <span>৳{getTotalAmount() + deliveryCharge}</span>
//           </div>
//         </div>

//         <button className="mt-6 w-full bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800">
//           Confirm Order
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;



import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext/CartContext";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const location = useLocation();
  const singleItem = location.state; // this will exist only if coming from Order Now

  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  // Determine order items
  const orderItems = singleItem ? [singleItem] : cartItems;

  const getTotalAmount = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left - Shipping Info */}
      <div className="md:col-span-2 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Phone Number" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Email Address" className="border p-2 rounded w-full" />
          <input type="text" placeholder="City" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Zip Code" className="border p-2 rounded w-full" />
          <input type="text" placeholder="Full Address" className="border p-2 rounded w-full md:col-span-2" />
        </div>

        {/* Delivery Area */}
        <div className="mt-6 space-y-2">
          <p className="font-semibold">Delivery Area</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryCharge"
              value="60"
              checked={deliveryCharge === 60}
              onChange={() => setDeliveryCharge(60)}
            />
            Inside Dhaka (৳60)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="deliveryCharge"
              value="120"
              checked={deliveryCharge === 120}
              onChange={() => setDeliveryCharge(120)}
            />
            Outside Dhaka (৳120)
          </label>
        </div>

        {/* Payment Method */}
        <div className="mt-6 space-y-2">
          <p className="font-semibold">Payment Method</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="Cash On Delivery"
              checked={paymentMethod === "Cash On Delivery"}
              onChange={() => setPaymentMethod("Cash On Delivery")}
            />
            Cash On Delivery
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="SSLCommerz"
              checked={paymentMethod === "SSLCommerz"}
              onChange={() => setPaymentMethod("SSLCommerz")}
            />
            Pay with SSLCommerz
          </label>
        </div>
      </div>

      {/* Right - Summary */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4 border-b pb-4">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                {item.selectedColor && <p className="text-gray-500">Color: {item.selectedColor}</p>}
                {item.selectedSize && <p className="text-gray-500">Size: {item.selectedSize}</p>}
              </div>
              <p className="text-green-700 font-semibold">
                ৳{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Total Calculation */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{getTotalAmount()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>৳{deliveryCharge}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span>{paymentMethod}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>৳{getTotalAmount() + deliveryCharge}</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800">
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
