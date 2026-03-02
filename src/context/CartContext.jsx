import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luckyGemsCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart", err);
      }
    }
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('luckyGemsCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (gemstone) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === gemstone.id);
      if (existing) {
        // Since gems are unique, usually quantity is 1. If stock allows more, we could increment.
        // For fine jewelry, we generally just prevent adding duplicates or increment if stock > 1.
        if (existing.quantity < gemstone.stock) {
          return prevCart.map(item => 
            item.id === gemstone.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prevCart;
      }
      return [...prevCart, { ...gemstone, quantity: 1 }];
    });
  };

  const removeFromCart = (gemstoneId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== gemstoneId));
  };

  const updateQuantity = (gemstoneId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(gemstoneId);
    setCart(prevCart => prevCart.map(item => 
      item.id === gemstoneId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Robustly handle strings like "$1,200.00"
      const priceNum = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
        : parseFloat(item.price);
      return total + (isNaN(priceNum) ? 0 : priceNum * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
