import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />

      <Header cartCount={cartCount} />
      <main className="flex-grow m-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
