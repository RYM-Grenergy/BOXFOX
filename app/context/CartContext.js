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

        // Pricing logic: Practical Tiered Step Pricing
        const diff = maxPrice - minPrice;
        let price = maxPrice;

        if (quantity >= 5000) price = minPrice;
        else if (quantity >= 1000) price = maxPrice - (diff * 0.4651);
        else if (quantity >= 500) price = maxPrice - (diff * 0.4205);
        else if (quantity >= 100) price = maxPrice - (diff * 0.3364);
        else if (quantity >= 50) price = maxPrice - (diff * 0.1682);
        else if (quantity >= 30) price = maxPrice - (diff * 0.10);
        else if (quantity >= 20) price = maxPrice - (diff * 0.05);
        else price = maxPrice;

        return parseFloat(price.toFixed(2));
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
