import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  // Add To Card LocalStorage
  const addToCart = (item) => {
    setCartItems((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.selectedColor === item.selectedColor &&
          i.selectedSize === item.selectedSize
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity =
          Number(updated[index].quantity) + Number(item.quantity);
        return updated;
      } else {
        return [...prev, { ...item, quantity: Number(item.quantity) }];
      }
    });
  };
  // LocalStorage Delete Card Products
  const clearCart = () => setCartItems([]);
  // CartContext.jsx

  const removeFromCart = (itemToRemove) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.selectedColor === itemToRemove.selectedColor &&
            item.selectedSize === itemToRemove.selectedSize
          )
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, clearCart, setCartItems, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
