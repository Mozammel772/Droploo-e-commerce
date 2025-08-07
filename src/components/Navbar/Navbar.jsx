/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaBars,
  FaMinus,
  FaPlus,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext/CartContext";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const subItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06 } }),
};

const Navbar = () => {
  const [cats, setCats] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [subcategoryView, setSubcategoryView] = useState(false);
  const [currentCat, setCurrentCat] = useState(null);
  const [settings, setSettings] = useState(null);

  // Updated cart functions from context
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  const [showCart, setShowCart] = useState(false);

  // Calculate total quantity
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetch("https://backend.droploo.com/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCats(json.data);
          setSelectedCategory(json.data[0] || null);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          "https://backend.droploo.com/api/general-data"
        );
        const data = await response.json();
        if (data.generalData) {
          setSettings(data.generalData);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchSettings();
  }, []);

  const openSub = (cat) => {
    if (cat.subcategories?.length > 0) {
      setCurrentCat(cat);
      setSubcategoryView(true);
    } else {
      setMenuOpen(false);
    }
  };

  // Cart item management functions
  const handleIncreaseQuantity = (item) => {
    increaseQuantity({
      id: item.id,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  };

  const handleDecreaseQuantity = (item) => {
    decreaseQuantity({
      id: item.id,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  };

  const handleRemoveItem = (item) => {
    removeFromCart({
      id: item.id,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    });
  };

  return (
    <div className=" w-full shadow-2xl fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Top bar and search UI */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-xl font-bold text-teal-700">
            <Link to="/" className="flex items-center">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="Company Logo"
                  className="h-10"
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Fallback to text if image fails
                    e.target.parentElement.innerHTML =
                      '<span className="text-xl font-bold">Droploo</span>';
                  }}
                />
              ) : (
                <span className="text-xl font-bold">Droploo</span>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded hover:bg-gray-200 cursor-pointer"
            >
              <FaSearch className="text-xl text-gray-600" />
            </button>
            <div className="relative cursor-pointer">
              <button
                onClick={() => setShowCart((prev) => !prev)}
                className="relative"
                aria-label="Cart"
              >
                <FaShoppingCart size={24} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 rounded-full px-2 text-xs font-bold">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="text-2xl text-teal-700 md:hidden p-2 rounded hover:bg-gray-200"
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="block md:hidden px-4 mt-2 transition-all duration-300">
            <div className="flex">
              <input
                type="search"
                placeholder="Search here..."
                className="input input-bordered w-full rounded-l-md border-teal-400"
              />
              <button
                className="bg-teal-600 cursor-pointer text-white px-4 rounded-r-md hover:bg-teal-700"
                onClick={() => setSearchOpen(false)}
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart Popup */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 bottom-0 right-0 w-80 bg-white text-black shadow-lg z-50 flex flex-col"
          >
            {/* Cart Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-semibold">Your Cart ({totalQuantity})</h3>
              <button
                className="text-lg font-bold hover:text-red-600"
                onClick={() => setShowCart(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="p-4 overflow-auto flex-1 flex items-center justify-center">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="p-4 overflow-auto flex-1">
                  <ul className="space-y-4">
                    {cartItems.map((item, i) => (
                      <motion.li
                        key={`${item.id}-${i}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-3 border-b pb-4 last:border-b-0 items-start"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-700">
                            ৳{item.price} × {item.quantity} = ৳
                            {item.price * item.quantity}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FaTrash />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Cart Footer */}
                <div className="p-4 border-t bg-white sticky bottom-0">
                  <div className="flex justify-between mb-4 font-bold">
                    <span>Total:</span>
                    <span>
                      ৳
                      {cartItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/cart-details"
                      onClick={() => setShowCart(false)}
                      className="flex-1 text-center bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700"
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={() => setShowCart(false)}
                      className="flex-1 text-center bg-teal-800 text-white font-semibold py-2 rounded hover:bg-teal-900"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop nav */}
      <div className="hidden md:flex bg-teal-600 text-white w-full">
        <div className="max-w-[1400px] mx-auto flex items-center space-x-6 py-2 px-4 w-full">
          <div
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            className="relative"
          >
            <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded cursor-pointer">
              Categories <FaAngleDown />
            </button>
            <AnimatePresence>
              {dropdownOpen && selectedCategory && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-0 z-50 mt-2 bg-white text-black shadow-xl rounded-md border flex gap-2"
                >
                  <ul className="w-56 max-h-96 overflow-y-auto border border-teal-500 p-2 rounded-md -mt-1 space-y-1 cursor-pointer">
                    {cats.map((c) => (
                      <li
                        key={c.id}
                        onMouseEnter={() => setSelectedCategory(c)}
                        className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-teal-100 ${
                          selectedCategory.id === c.id
                            ? "bg-teal-50 font-semibold"
                            : ""
                        }`}
                      >
                        <Link
                          to={`/products-collection/${c.slug}`}
                          className="flex-1 text-left text-gray-700 hover:text-teal-700"
                        >
                          {c.name}
                        </Link>
                        {c.subcategories && c.subcategories.length > 0 && (
                          <FaAngleRight className="text-gray-400" />
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul className="w-56 p-2 space-y-2 border border-teal-600 rounded-md">
                    {selectedCategory.subcategories?.map((sub, i) => (
                      <motion.li
                        key={sub.id}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={subItemVariants}
                        className="hover:text-teal-600 cursor-pointer"
                      >
                        <Link
                          to={`/products-collection/${selectedCategory.slug}/${sub.slug}`}
                        >
                          {sub.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/products-collection" className="hover:underline">
            Shop
          </Link>
          <Link
            to="/products-collection/discount-products"
            className="hover:underline"
          >
            Offer Products
          </Link>
          <Link to="/return-process" className="hover:underline">
            Return Process
          </Link>
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed top-0 left-0 h-full w-72  bg-white shadow-xl z-50 overflow-y-auto md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-3 py-3 border-b border-teal-500 shadow-xl mb-3">
                <h2 className="text-xl font-semibold">
                  {subcategoryView ? currentCat.name : "Menu"}
                </h2>
                <motion.button
                  onClick={() => setMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="text-xl text-red-600 cursor-pointer" />
                </motion.button>
              </div>

              <div className="px-2 space-y-2 pb-4">
                {!subcategoryView ? (
                  <>
                    {/* Home - First item */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 font-medium bg-gray-100 rounded hover:bg-teal-100"
                      >
                        Home
                      </Link>
                    </motion.div>

                    {/* Products - Second item */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Link
                        to="/products-collection"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 font-medium bg-gray-100 rounded hover:bg-teal-100"
                      >
                        Products
                      </Link>
                    </motion.div>

                    {/* Dynamic Categories - Each with increasing delay */}
                    {cats.map((c, index) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      >
                        <Link
                          to={`/products-collection/${c.slug}`}
                          onClick={() => openSub(c)}
                          className="w-full flex justify-between items-center px-3 py-3 bg-gray-100 rounded hover:bg-teal-100 text-gray-700 font-semibold cursor-pointer"
                        >
                          <span>{c.name}</span>
                          {c.subcategories?.length > 0 && (
                            <FaAngleRight className="text-gray-500" />
                          )}
                        </Link>
                      </motion.div>
                    ))}

                    {/* {cats.map((c, index) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      >
                        <button
                          onClick={() => openSub(c)}
                          className="w-full flex justify-between items-center px-3 py-3 bg-gray-100 rounded hover:bg-teal-100 text-gray-700 font-semibold cursor-pointer"
                        >
                          <span>{c.name}</span>
                          {c.subcategories?.length > 0 && (
                            <FaAngleRight className="text-gray-500" />
                          )}
                        </button>
                      </motion.div>
                    ))} */}

                    {/* About - Last item */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + cats.length * 0.1,
                      }}
                    >
                      <Link
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 font-medium bg-gray-100 rounded hover:bg-teal-100"
                      >
                        About
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Back button - First in submenu */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <button
                        onClick={() => setSubcategoryView(false)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-teal-600 cursor-pointer"
                      >
                        <FaAngleLeft /> Back
                      </button>
                    </motion.div>

                    {/* Parent category - Second in submenu */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Link
                        to={`/products-collection/${currentCat.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 bg-teal-50 text-teal-700 font-semibold tracking-wide rounded hover:bg-teal-100 cursor-pointer"
                      >
                        {currentCat.name}
                      </Link>
                    </motion.div>

                    {/* Subcategories - Each with increasing delay */}
                    {currentCat.subcategories?.map((sub, i) => (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                      >
                        <Link
                          to={`/products-collection/${currentCat.slug}/${sub.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="block px-5 py-2 font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded"
                        >
                          {sub.name}
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>

            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
