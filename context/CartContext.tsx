"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedWeight?: string;
  calculatedPrice?: number;
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
    // Validate product price
    const priceToUse = product.calculatedPrice || product.price;
    
    if (!priceToUse || isNaN(priceToUse) || priceToUse < 0) {
      console.error('[CartContext] Invalid product price:', {
        name: product.name,
        price: product.price,
        calculatedPrice: product.calculatedPrice,
        priceToUse
      });
      return;
    }

    console.log('[CartContext] Adding to cart:', {
      name: product.name,
      price: priceToUse,
      quantity: product.quantity || 1,
      selectedWeight: product.selectedWeight
    });

    setCartItems((prevItems) => {
      // Check for existing item with same id and selectedWeight
      const existingItem = prevItems.find((item) =>
        item.id === product.id &&
        item.selectedWeight === product.selectedWeight
      );

      if (existingItem) {
        console.log('[CartContext] Item already exists, updating quantity');
        return prevItems.map((item) =>
          item.id === product.id && item.selectedWeight === product.selectedWeight
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      console.log('[CartContext] Adding new item to cart');
      return [...prevItems, {
        ...product,
        price: priceToUse,
        quantity: product.quantity || 1
      }];
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

  // Calculate subtotal with proper decimal handling
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.calculatedPrice || item.price;
    const itemTotal = itemPrice * item.quantity;
    console.log('[CartContext] Item calculation:', {
      name: item.name,
      price: itemPrice,
      quantity: item.quantity,
      itemTotal: itemTotal
    });
    return total + itemTotal;
  }, 0);

  console.log('[CartContext] Subtotal calculated:', subtotal);

  const getDiscountRate = (couponCode: string): number => {
    const discountRates = {
      'GORKHA10': 0.1,  // 10% discount
      'IDAY30': 0.3     // 30% discount
    };
    return discountRates[couponCode as keyof typeof discountRates] || 0;
  };

  const discount = coupon ? subtotal * getDiscountRate(coupon) : 0;
  console.log('[CartContext] Discount:', discount);

  const totalPrice = Math.round(subtotal - discount); // Round to nearest rupee for consistency
  console.log('[CartContext] Final totalPrice:', totalPrice);

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
