"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem('boxfox_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('boxfox_cart', JSON.stringify(cart));
    }, [cart]);

    const calculateUnitPrice = (product, quantity) => {
        const basePrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
        const minPrice = typeof product.minPrice === 'number' ? product.minPrice : parseFloat(String(product.minPrice).replace(/[^0-9.]/g, '')) || basePrice;
        const maxPrice = typeof product.maxPrice === 'number' ? product.maxPrice : parseFloat(String(product.maxPrice).replace(/[^0-9.]/g, '')) || basePrice;
        const moq = product.minOrderQuantity || 100;

        // Pricing logic: linearly scale from maxPrice at MOQ to minPrice at MOQ + 5000
        const price = maxPrice - (maxPrice - minPrice) * Math.min(1, (quantity - moq) / 5000);
        return price;
    };

    const addToCart = (product, quantity) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                const newQuantity = existing.quantity + quantity;
                return prev.map(item => item.id === product.id
                    ? {
                        ...item,
                        quantity: newQuantity,
                        price: calculateUnitPrice(item, newQuantity)
                    }
                    : item
                );
            }
            return [...prev, {
                ...product,
                quantity,
                price: calculateUnitPrice(product, quantity)
            }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (id, quantity) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity,
                    price: calculateUnitPrice(item, quantity)
                };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        return sum + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
