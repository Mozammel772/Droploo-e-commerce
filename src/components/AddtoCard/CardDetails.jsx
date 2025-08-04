import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext/CartContext";

const CartDetails = () => {
  const { cartItems, setCartItems } = useCart();

  const handleQuantityChange = (index, value) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = parseInt(value) || 1;
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
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-4 md:p-10 max-w-[1400px] mx-auto">
      <Link
        to="/"
        className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
      >
        Continue Shopping
      </Link>

      {cartItems.length === 0 ? (
        <p className="mt-6 text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border-collapse border border-gray-50">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Product Name</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, i) => (
                  <tr key={i} className="text-center border-b">
                    <td className="p-3 border">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 border font-semibold">{item.name}</td>
                    <td className="p-3 border">৳{item.price}</td>
                    <td className="p-3 border">
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                          handleQuantityChange(i, e.target.value)
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </td>
                    <td className="p-3 border font-bold text-green-700">
                      ৳{item.price * item.quantity}
                    </td>
                    <td className="p-3 border">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteCartItem(i)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Checkout */}
          <div className="mt-6 flex justify-center">
            <div className="text-center">
              <p className="text-xl font-semibold mb-4">
                Grand Total: ৳{getTotalAmount()}
              </p>
              <Link to="/checkout" className="block">
                <button className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 w-full">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDetails;
