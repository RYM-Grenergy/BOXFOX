"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { calculateBoxPrice } from '@/lib/boxfoxPricing';
import { BOX_SPECIFICATIONS } from '@/lib/box-specifications';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const savedCart = localStorage.getItem('boxfox_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('boxfox_cart', JSON.stringify(cart));
    }, [cart]);

    const calculateUnitPrice = (product, quantity) => {
        // If this is a custom design box, we respect the price settings from the Lab
        if (product.customDesign) {
            const pricingParams = {
                spec: product.customDesign.specData || { ups: 1, machine: 2029, sheetW: 20, sheetH: 29 },
                qty: quantity,
                gsm: parseInt(product.customDesign.selectedGSM) || 300,
                material: product.customDesign.selectedMaterial || 'SBS',
                brand: 'Normal', // Default or could be stored in customDesign
                colours: 'Four Colour', // Default or could be stored
                lamination: product.customDesign.selectedFinish || 'Plain',
                markupType: 'Retail',
                dieCutting: true
            };
            const res = calculateBoxPrice(pricingParams);
            return res.finalPerUnit;
        }

        // For regular products, try to match a manufacturing spec for accurate pricing
        const unit = product.dimensions?.unit || 'in';
        const dimensions = {
            l: product.dimensions?.length || 1,
            w: product.dimensions?.width || 1,
            h: product.dimensions?.height || 1
        };

        const selectedSpec = BOX_SPECIFICATIONS.find(s =>
            s.l === dimensions.l &&
            s.w === dimensions.w &&
            s.h === dimensions.h &&
            s.unit === unit
        );

        const pricingResult = calculateBoxPrice({
            spec: selectedSpec || { ups: 1, machine: 2029, sheetW: 20, sheetH: 29 },
            qty: quantity,
            gsm: 300,
            material: 'SBS',
            brand: 'Normal',
            colours: 'Four Colour',
            lamination: 'Plain',
            markupType: 'Retail',
            dieCutting: true
        });

        return pricingResult.finalPerUnit;
    };

    const addToCart = (product, quantity) => {
        let isUpdate = false;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                isUpdate = true;
                const newQuantity = existing.quantity + Math.max(0, quantity);
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

        showToast(isUpdate ? `Updated ${product.name} quantity` : `Added ${product.name} to basket`);
        setIsCartOpen(true);
    };

    const updateQuantity = (id, quantity) => {
        const validQuantity = Math.max(10, Math.floor(quantity));
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: validQuantity,
                    price: calculateUnitPrice(item, validQuantity)
                };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        const itemToRemove = cart.find(i => i.id === id);
        setCart(prev => prev.filter(item => item.id !== id));
        if (itemToRemove) {
            showToast(`Removed ${itemToRemove.name} from basket`, "info");
        }
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
