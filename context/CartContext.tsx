"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  applyCoupon: (coupon: string) => void;
  cartCount: number;
  totalPrice: number;
  discount: number;
  couponError: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [coupon, setCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState('');

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const applyCoupon = (couponCode: string) => {
    const validCoupons = {
      'GORKHA10': 0.1,  // 10% discount
      'IDAY30': 0.3     // 30% discount for Independence Day
    };

    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setCoupon(couponCode);
      setCouponError('');
    } else {
      setCoupon('');
      setCouponError('Invalid coupon code');
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getDiscountRate = (couponCode: string): number => {
    const discountRates = {
      'GORKHA10': 0.1,  // 10% discount
      'IDAY30': 0.3     // 30% discount
    };
    return discountRates[couponCode as keyof typeof discountRates] || 0;
  };

  const discount = coupon ? subtotal * getDiscountRate(coupon) : 0;

  const totalPrice = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        cartCount,
        totalPrice,
        discount,
        couponError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
