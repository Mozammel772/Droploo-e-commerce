/* eslint-disable react-refresh/only-export-components */
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

const addToCart = (item) => {
  setCartItems((prev) => {
    const index = prev.findIndex(
      (i) =>
        i.id === item.id &&
        i.selectedColor === item.selectedColor &&
        i.selectedSize === item.selectedSize
    );
    if (index !== -1) {
      // শুধু কোয়ান্টিটি রিপ্লেস করছে, যোগ করছে না
      const updated = [...prev];
      updated[index].quantity = Number(item.quantity);
      return updated;
    } else {
      return [...prev, { ...item, quantity: Number(item.quantity) }];
    }
  });
};


  // কার্ট থেকে আইটেম রিমুভ করার ফাংশন
  const removeFromCart = (item) => {
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.id === item.id &&
            i.selectedColor === item.selectedColor &&
            i.selectedSize === item.selectedSize
          )
      )
    );
  };

  // কোয়ান্টিটি বাড়ানোর ফাংশন
  const increaseQuantity = (item) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === item.id &&
        i.selectedColor === item.selectedColor &&
        i.selectedSize === item.selectedSize
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  // কোয়ান্টিটি কমানোর ফাংশন
  const decreaseQuantity = (item) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === item.id &&
        i.selectedColor === item.selectedColor &&
        i.selectedSize === item.selectedSize
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i
      )
    );
  };

  // সম্পূর্ণ কার্ট ক্লিয়ার করার ফাংশন
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        setCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);