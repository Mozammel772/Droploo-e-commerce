import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../../Context/CartContext/CartContext";

const CheckoutPage = () => {
  const { cartItems, clearCart, removeFromCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const singleItem = location.state;
  const orderItems = singleItem ? [singleItem] : cartItems;
  console.log("card ", orderItems);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  const getTotalAmount = () => {
    return orderItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      Swal.fire("Error", "Please enter your full name", "error");
      return false;
    }

    if (!formData.phone?.trim()) {
      Swal.fire("Error", "Please enter your phone number", "error");
      return false;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      Swal.fire(
        "Error",
        "Please enter a valid Bangladeshi phone number (11 digits starting with 01)",
        "error"
      );
      return false;
    }

    if (!formData.address?.trim()) {
      Swal.fire("Error", "Please enter your full address", "error");
      return false;
    }

    if (orderItems.length === 0) {
      Swal.fire("Error", "Your cart is empty", "error");
      return false;
    }

    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Prepare products array according to backend requirements
    const products = orderItems.map((item) => ({
      id: item.id || 0, // Must be number
      name: item.name || "Unknown Product",
      color: item.selectedColor || "N/A",
      size: item.selectedSize || "N/A",
      price: item.price || 0, // Must be number
      qty: item.quantity || 1, // Changed back to 'qty' and must be number
    }));

    // Construct payload matching backend expectations
    const payload = {
      ip_address: "127.0.0.1", // Will be replaced with actual IP in production
      customer_name: formData.name.trim(),
      customer_phone: formData.phone.trim(),
      delivery_area: deliveryCharge === 60 ? 1 : 2, // Changed to numeric values
      customer_address: formData.address.trim(),
      product_quantity: orderItems.reduce(
        (sum, item) => sum + (parseInt(item.quantity) || 1),
        0
      ),
      price: parseFloat((getTotalAmount() + deliveryCharge).toFixed(2)), // Changed to 'price'
      payment_type: paymentMethod === "Cash On Delivery" ? "Cash" : "Online",
      order_type: "Online",
      customer_type: "Old Customer",
      employee_id: 1,
      products: products,
    };

    console.log("Final Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(
        "https://backend.droploo.com/api/confirm-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(", ") : messages
                }`
            )
            .join("\n");
          throw new Error(`Validation errors:\n${errorMessages}`);
        }
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }

      if (data.success) {
        await Swal.fire({
          title: "Success!",
          text: data.message || "Your order has been placed successfully",
          icon: "success",
          confirmButtonText: "Continue",
        });
        clearCart();
        navigate("/order-success", {
          state: {
            orderId: data.data?.orderId || "N/A",
            customerName: formData.name.trim(),
            totalAmount: payload.price,
          },
        });
      } else {
        throw new Error(data.message || "Order failed without specific reason");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      Swal.fire({
        title: "Order Failed",
        html: error.message.replace(/\n/g, "<br>"),
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left - Shipping Info */}
      <div className="md:col-span-2 bg-white p-6 rounded shadow">
        <h2 className="text-xl md:text-3xl font-semibold mb-4">
          Shipping Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              className="w-full border border-teal-500 rounded-md px-1 md:px-3 py-2 focus:outline-none focus:ring-0.5 focus:ring-teal-500 focus:border-teal-600 focus:shadow-xl transition"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              name="phone"
              placeholder="01XXXXXXXXX"
              className="w-full border border-teal-500 rounded-md px-1 md:px-3 py-2 focus:outline-none focus:ring-0.5 focus:ring-teal-500 focus:border-teal-600 focus:shadow-xl transition"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Full Address *
            </label>
            <textarea
              name="address"
              placeholder="House# Road#, Area, City"
              className="w-full border border-teal-500 h-24 rounded-md px-1 md:px-3 py-2 focus:outline-none focus:ring-0.5 focus:ring-teal-500 focus:border-teal-600 focus:shadow-xl transition"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Delivery Area *
          </label>
          <div className="space-y-2 mt-1">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deliveryCharge"
                value="60"
                checked={deliveryCharge === 60}
                onChange={() => setDeliveryCharge(60)}
                className="mr-1"
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
                className="mr-1"
              />
              Outside Dhaka (৳120)
            </label>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Payment Method *</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash On Delivery"
                checked={paymentMethod === "Cash On Delivery"}
                onChange={() => setPaymentMethod("Cash On Delivery")}
                className="mr-2"
              />
              <div>
                <p className="font-medium">Cash On Delivery</p>
                <p className="text-sm text-gray-600">
                  Pay when you receive the product
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="SSLCommerz"
                checked={paymentMethod === "SSLCommerz"}
                onChange={() => setPaymentMethod("SSLCommerz")}
                className="mr-2"
              />
              <div>
                <p className="font-medium">Online Payment</p>
                <p className="text-sm text-gray-600">
                  Pay with credit/debit card or mobile banking
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Right - Order Summary */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-4 border-b pb-4 max-h-96 overflow-y-auto">
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center border border-gray-300 rounded-md p-3"
            >
              {/* Image */}
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content (80%) */}
              <div className="w-[85%] px-3">
                <p className="font-medium text-gray-800">
                  {item.name.length > 50
                    ? item.name.slice(0, 50) + "..."
                    : item.name}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-sm">
                  <p className="text-green-700 font-semibold whitespace-nowrap">
                    ৳{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-gray-600">{item.quantity} items</p>

                  {item.selectedColor ? (
                    <p>{item.selectedColor}</p>
                  ) : (
                    <span className="text-gray-400">No Color</span>
                  )}
                  {item.selectedSize ? (
                    <p>{item.selectedSize}</p>
                  ) : (
                    <span className="text-gray-400">No Size</span>
                  )}
                </div>
              </div>

              {/* Delete icon (20%) */}
              <div className="w-[15%] flex justify-center items-center">
                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{getTotalAmount().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>৳{deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="capitalize">{paymentMethod.toLowerCase()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>৳{(getTotalAmount() + deliveryCharge).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleConfirmOrder}
          disabled={isSubmitting}
          className={`mt-6 w-full px-6 py-3 rounded font-semibold ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Confirm Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;

// import { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useCart } from "../../Context/CartContext/CartContext";

// const CheckoutPage = () => {
//   const { cartItems } = useCart();
//   const location = useLocation();
//   const singleItem = location.state; // this will exist only if coming from Order Now

//   const [deliveryCharge, setDeliveryCharge] = useState(60);
//   const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

//   // Determine order items
//   const orderItems = singleItem ? [singleItem] : cartItems;

//   const getTotalAmount = () => {
//     return orderItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );
//   };

//   return (
//     <div className="max-w-[1400px] mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
//           {orderItems.map((item, index) => (
//             <div key={index} className="flex justify-between items-center text-sm">
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-gray-600">Qty: {item.quantity}</p>
//                 {item.selectedColor && <p className="text-gray-500">Color: {item.selectedColor}</p>}
//                 {item.selectedSize && <p className="text-gray-500">Size: {item.selectedSize}</p>}
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
