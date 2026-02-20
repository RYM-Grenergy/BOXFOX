"use client";
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Filter } from "lucide-react";
import ProductSection from "../components/ProductSection";

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-24">
                <header className="px-6 lg:px-12 mb-16 max-w-[1600px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter"
                            >
                                The Shop.
                            </motion.h1>
                            <p className="text-xl text-gray-400 font-medium mt-4">Browse through our entire catalog of structural packaging.</p>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-100 rounded-2xl px-6 py-4 w-full md:w-96 shadow-inner">
                            <Search size={20} className="text-gray-400" />
                            <input type="text" placeholder="Search products..." className="bg-transparent outline-none w-full font-bold text-gray-950" />
                            <Filter size={20} className="text-gray-400 cursor-pointer hover:text-gray-950 transition-colors" />
                        </div>
                    </div>
                </header>

                <ProductSection />
            </main>
            <Footer />
        </div>
    );
}
