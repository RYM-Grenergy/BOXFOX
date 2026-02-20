import Link from "next/link";
import { ShoppingCart, Heart, ArrowUpRight } from "lucide-react";

export default function ProductCard({ product, imageOnly = false }) {
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
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-end justify-between">
          <div className="max-w-[70%]">
            <h4 className="text-white font-black text-sm leading-tight line-clamp-2">{name}</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-lg">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex flex-col h-full">
      {/* Visual Area */}
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-gray-200/50">
        <Link href={`/products/${id}`} className="block h-full">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
          {discount && !outOfStock && (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              Save {discount}
            </span>
          )}
          {badge && (
            <span className="bg-gray-950/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              {badge}
            </span>
          )}
          {outOfStock && (
            <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest whitespace-nowrap">
              Out Of Stock
            </span>
          )}
        </div>

        {/* Interaction Elements */}
        <button className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-xl rounded-full text-gray-950 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-90 shadow-xl border border-white/20">
          <Heart size={18} />
        </button>

        {!outOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <Link
              href={`/products/${id}`}
              className="w-full bg-gray-950 text-white text-[10px] font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-2xl uppercase tracking-[0.2em]"
            >
              <ShoppingCart size={14} className="mb-0.5" />
              Configure in Lab
            </Link>
          </div>
        )}
      </div>

      {/* Information Area */}
      <div className="flex flex-col flex-grow px-2">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-black text-gray-950 leading-tight tracking-tight line-clamp-2 group-hover:text-emerald-500 transition-colors">
            {name}
          </h3>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-gray-950 tracking-tighter">
              {typeof price === 'string' ? price : `₹${price?.toFixed(2)}`}
            </span>
            {originalPrice && (
              <span className="text-sm font-bold text-gray-300 line-through">
                ₹{originalPrice.toFixed(0)}
              </span>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}


