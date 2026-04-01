export const getCartItems = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const addToCart = (product) => {
  const existingCart = getCartItems();

  const productExists = existingCart.find((item) => item._id === product._id);

  if (productExists) {
    return {
      success: false,
      message: "Product already added to cart",
    };
  }

  existingCart.push(product);
  localStorage.setItem("cart", JSON.stringify(existingCart));
  window.dispatchEvent(new Event("cartUpdated"));

  return {
    success: true,
    message: "Product added to cart successfully",
  };
};

export const removeFromCart = (id) => {
  const existingCart = getCartItems();
  const updatedCart = existingCart.filter((item) => item._id !== id);

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));

  return updatedCart;
};

export const getCartCount = () => {
  return getCartItems().length;
};

export const getCartTotal = () => {
  return getCartItems().reduce(
    (total, item) => total + Number(item.price || 0),
    0,
  );
};
// Add this function
export const clearCart = () => {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("cartUpdated"));
};
