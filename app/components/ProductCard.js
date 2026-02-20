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

  const discountPct =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : discount;

  if (imageOnly) {
    return (
      <Link
        href={`/products/${id}`}
        className="product-card image-only card group block relative"
        aria-label={name}
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-50 aspect-square">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h4 className="text-white font-bold text-sm leading-snug mb-2">{name}</h4>
            <div className="flex items-center justify-between">
              <span className="text-white text-lg font-black">
                ₹{price?.toFixed(0) ?? "—"}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="product-card group flex flex-col gap-4">
      {/* Image */}
      <Link href={`/products/${id}`} className="relative overflow-hidden rounded-[2rem] bg-gray-50 aspect-square block">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {discountPct && !outOfStock && (
            <span className="bg-white text-gray-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              -{discountPct}%
            </span>
          )}
          {outOfStock && (
            <span className="bg-gray-100 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">
              Sold Out
            </span>
          )}
          {badge && (
            <span className="bg-gray-950 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {badge}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-950 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm">
          <Heart size={16} />
        </button>

        {/* Quick Add */}
        {!outOfStock && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-full bg-white/90 backdrop-blur-md text-gray-950 text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-colors">
              <ShoppingCart size={14} />
              QUICK ADD
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="px-2">
        <Link href={`/products/${id}`} className="block">
          <h3 className="text-sm font-bold text-gray-950 leading-snug line-clamp-2 mb-2 hover:text-gray-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            {outOfStock ? (
              <span className="text-sm font-bold text-gray-300">Out of Stock</span>
            ) : (
              <>
                <span className="text-lg font-black text-gray-950 tracking-tight">
                  ₹{price?.toFixed(0)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-300 line-through">
                    ₹{originalPrice?.toFixed(0)}
                  </span>
                )}
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}

