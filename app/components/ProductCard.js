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
    pacdoraId,
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
    <Link href={`/products/${id}`} className="group flex flex-col h-full relative">
      <div className="relative mb-4 sm:mb-5 aspect-square overflow-hidden rounded-[1.2rem] sm:rounded-[2rem] bg-gray-50 border border-gray-950/[0.08] shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-emerald-500/10 group-hover:border-gray-950/20">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 sm:top-6 sm:left-6 flex flex-col gap-1 sm:gap-2 pointer-events-none">
          {discount && !outOfStock && (
            <span className="bg-emerald-500 text-white text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              -{discount}
            </span>
          )}
          {badge && (
            <span className="bg-gray-950/90 backdrop-blur-md text-white text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              {badge}
            </span>
          )}
          {pacdoraId && (
            <span className="bg-emerald-500 text-white text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
              <Plus size={8} /> 3D READY
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow px-1.5 gap-2">
        <h3 className="text-[12px] sm:text-lg font-black text-gray-950 leading-[1.1] tracking-tighter uppercase line-clamp-2 group-hover:text-emerald-500 transition-colors">
          {name}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-100 gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] sm:text-2xl font-black text-gray-950 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
              {typeof price === 'string' ? price : `₹${price?.toLocaleString('en-IN')}`}
            </span>
            {originalPrice && (
              <span className="text-[10px] sm:text-sm font-bold text-gray-300 line-through whitespace-nowrap">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 px-4 py-2 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm border border-emerald-100/50 w-full sm:w-auto mt-1 sm:mt-0">
            View Details
            <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
