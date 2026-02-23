import Link from "next/link";
import { ShoppingCart, Heart, ArrowUpRight, Plus } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function ProductCard({ product, imageOnly = false }) {
  const { addToCart } = useCart();
  const {
    id,
    name,
    img,
    price,
    originalPrice,
    discount,
    outOfStock,
    hasVariants,
    badge,
  } = product;

  // Handle Quick Add
  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  if (imageOnly) {
    return (
      <Link
        href={`/products/${id}`}
        className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-50 bg-white shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2"
        aria-label={name}
      >
        <img
          src={img}
          alt={name}
          className="w-full h-full object-contain p-8 transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-end justify-between">
          <div className="max-w-[70%]">
            <h4 className="text-white font-black text-sm leading-tight line-clamp-2 uppercase tracking-tight">{name}</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-lg">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex flex-col h-full relative">
      {/* visual area */}
      <div className="relative mb-3 sm:mb-6 aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-gray-200/50">
        <Link href={`/products/${id}`} className="block h-full">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-contain p-4 sm:p-8 transition-transform duration-1000 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 flex flex-col gap-1 sm:gap-2 pointer-events-none">
          {discount && !outOfStock && (
            <span className="bg-emerald-500 text-white text-[6px] sm:text-[9px] font-black px-1.5 sm:px-4 py-0.5 sm:py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              -{discount}
            </span>
          )}
          {badge && (
            <span className="bg-gray-950/90 backdrop-blur-md text-white text-[6px] sm:text-[9px] font-black px-1.5 sm:px-4 py-0.5 sm:py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>

        {/* Interaction Elements - Only show on large screens or hover */}
        {!outOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
            <Link
              href={`/products/${id}`}
              className="w-full bg-gray-950 text-white text-[10px] font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-2xl uppercase tracking-[0.2em]"
            >
              View Details
            </Link>
          </div>
        )}
      </div>

      {/* Information Area */}
      <div className="flex flex-col px-1">
        <h3 className="text-[10px] sm:text-lg font-black text-gray-950 leading-tight tracking-tighter uppercase line-clamp-2 group-hover:text-emerald-500 transition-colors mb-1 sm:mb-2">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm sm:text-2xl font-black text-gray-950 tracking-tighter">
            {typeof price === 'string' ? price : `₹${price?.toLocaleString('en-IN')}`}
          </span>
          {originalPrice && (
            <span className="text-[9px] sm:text-sm font-bold text-gray-300 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}



