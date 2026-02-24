"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ArrowLeft,
  Box,
  Sparkles,
  Ruler,
  RefreshCw,
  Download,
  Minus,
  Plus,
  Move,
  Search,
  ChevronDown,
  CheckCircle2,
  RotateCw,
  Maximize2,
  Zap,
  Upload,
  Type,
  Image as ImageIcon,
  Layout,
  Trash2,
  Palette,
  Layers,
  Scissors,
  Shield,
  Check,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

function CustomizeLabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // Default Product ID for the Standalone Lab
  const DEFAULT_PRODUCT_ID = "1771670990303";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(10);
  const [viewMode, setViewMode] = useState("2D");

  // Customization States
  const [dimensions, setDimensions] = useState({ l: 12, w: 8, h: 4 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPromptEnhanced, setIsPromptEnhanced] = useState(false);
  const [customText, setCustomText] = useState("");

  // AI Forge: Smart Prompt Builder
  const [selectedChips, setSelectedChips] = useState([]);
  const [activeChipCategory, setActiveChipCategory] = useState("style");
  const [showSmartPreview, setShowSmartPreview] = useState(false);

  // Text-on-Box options
  const [textOnBox, setTextOnBox] = useState(false);
  const [boxTextColor, setBoxTextColor] = useState("#FFFFFF");
  const [boxTextStyle, setBoxTextStyle] = useState("bold"); // bold | script | minimal

  // Neural Multi-Asset Pool (Max 3)
  const [assetPool, setAssetPool] = useState([]);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [boxTextures, setBoxTextures] = useState({
    front: null,
    back: null,
    top: null,
    bottom: null,
    left: null,
    right: null,
  });
  const [boxColors, setBoxColors] = useState({
    front: "#059669",
    back: "#059669",
    top: "#059669",
    bottom: "#059669",
    left: "#059669",
    right: "#059669",
  });
  const [activeColor, setActiveColor] = useState("#059669");
  const [customMode, setCustomMode] = useState("texture"); // 'texture' or 'color'
  const [boxMode, setBoxMode] = useState("mailers"); // B2B Box types

  // Rotation State
  const [rotate, setRotate] = useState({ x: -20, y: 45 });
  const isDragging = useRef(false);
  const prevTouch = useRef(null);

  useEffect(() => {
    // Sync dimensions from URL if present
    const l = searchParams.get('length');
    const w = searchParams.get('width');
    const h = searchParams.get('height');

    if (l || w || h) {
      setDimensions({
        l: parseFloat(l) || dimensions.l,
        w: parseFloat(w) || dimensions.w,
        h: parseFloat(h) || dimensions.h
      });
    }

    setLoading(true);
    fetch(`/api/products/${DEFAULT_PRODUCT_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setQuantity(data.minOrderQuantity || 10);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAsset = reader.result;
        setAssetPool((prev) => {
          const updated = [...prev, newAsset].slice(-3); // Keep last 3
          setActiveAssetIndex(updated.length - 1);
          return updated;
        });
        if (assetPool.length === 0) {
          setBoxTextures((prev) => ({ ...prev, front: newAsset }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFaceMapping = (face) => {
    if (customMode === "texture") {
      const currentAsset = assetPool[activeAssetIndex];
      if (!currentAsset) return;
      setBoxTextures((prev) => ({
        ...prev,
        [face]: prev[face] === currentAsset ? null : currentAsset,
      }));
    } else {
      setBoxColors((prev) => ({
        ...prev,
        [face]: activeColor,
      }));
    }
  };

  const applyToAllFaces = () => {
    if (customMode === "texture") {
      const currentAsset = assetPool[activeAssetIndex];
      if (!currentAsset) return;
      setBoxTextures({
        front: currentAsset,
        back: currentAsset,
        top: currentAsset,
        bottom: currentAsset,
        left: currentAsset,
        right: currentAsset,
      });
    } else {
      setBoxColors({
        front: activeColor,
        back: activeColor,
        top: activeColor,
        bottom: activeColor,
        left: activeColor,
        right: activeColor,
      });
    }
  };

  const clearAllFaces = () => {
    setBoxTextures({
      front: null,
      back: null,
      top: null,
      bottom: null,
      left: null,
      right: null,
    });
    setBoxColors({
      front: "#059669",
      back: "#059669",
      top: "#059669",
      bottom: "#059669",
      left: "#059669",
      right: "#059669",
    });
  };

  const smartApplyAI = (imageSrc) => {
    setAssetPool((prev) => {
      const updated = [...prev, imageSrc].slice(-3);
      setActiveAssetIndex(updated.length - 1);
      return updated;
    });
    setBoxTextures({
      front: imageSrc,
      back: imageSrc,
      top: imageSrc,
      bottom: imageSrc,
      left: imageSrc,
      right: imageSrc,
    });
  };

  // Chip categories for smart prompt builder
  const chipCategories = {
    style: [
      "Luxury Premium",
      "Eco & Sustainable",
      "Bold & Playful",
      "Minimal & Clean",
      "Festive & Celebratory",
      "Professional Corporate",
      "Rustic Artisan",
      "Modern High-End",
      "Vintage Classic",
      "Ultra Sleek",
    ],
    industry: [
      "Retail Shopping",
      "Food & Bakery",
      "Cosmetics & Beauty",
      "Corporate Gifting",
      "Apparel & Fashion",
      "Jewelry & Luxury",
      "E-Commerce Mailer",
      "Subscription Box",
      "Artisan & Craft",
      "Health & Wellness",
    ],
  };

  const toggleChip = (chip) =>
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );

  const enhancePrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsEnhancing(true);
    try {
      const chips =
        selectedChips.length > 0
          ? ` Style tags: ${selectedChips.join(", ")}.`
          : "";
      const boxTypeMap = {
        mailers: "e-commerce mailer box",
        confectionary: "food-grade cake box",
        pizza: "pizza delivery box",
        luxury: "luxury rigid gift box",
      };
      const boxType = boxTypeMap[boxMode] || "packaging box";
      const systemMsg = `You are a professional packaging design prompt engineer. The user describes their box design idea. Rewrite it as a rich, detailed design brief for AI image generation focused on ${boxType} packaging.${chips} Keep it under 60 words. No bullet points. Plain text only.`;
      const result = await window.puter.ai.chat(
        systemMsg + "\n\nUser idea: " + aiPrompt.trim(),
      );
      const enhanced =
        typeof result === "string"
          ? result
          : result?.message?.content?.[0]?.text ||
          result?.toString() ||
          aiPrompt;
      setAiPrompt(enhanced.trim());
      setIsPromptEnhanced(true);
    } catch (e) {
      console.error("Enhance error", e);
    }
    setIsEnhancing(false);
  };

  const buildSmartPrompt = () => {
    // If the prompt was AI-enhanced, use it directly — it's already a complete design brief
    if (isPromptEnhanced && aiPrompt.trim()) {
      return (
        aiPrompt.trim() + ", photorealistic packaging mockup, 8K resolution"
      );
    }
    const parts = [];
    if (aiPrompt.trim()) parts.push(aiPrompt.trim());
    if (selectedChips.length > 0) parts.push(selectedChips.join(", "));
    const boxTypeMap = {
      mailers: "e-commerce mailer box packaging",
      confectionary: "food-grade cake box packaging",
      pizza: "pizza delivery box packaging",
      luxury: "luxury rigid gift box packaging",
    };
    parts.push(boxTypeMap[boxMode] || "product packaging box");
    parts.push(
      "professional packaging artwork, flat lay box wrap design, clean brand print, high quality product packaging, 8K resolution",
    );
    return parts.join(", ");
  };

  const textStyleMap = {
    bold: "font-black tracking-widest text-center",
    script: "font-bold italic tracking-wide text-center",
    minimal: "font-light tracking-[0.5em] uppercase text-center",
  };

  const maxVal = Math.max(dimensions.l, dimensions.w, dimensions.h);
  const factor = 320 / maxVal;
  const L = dimensions.l * factor;
  const W = dimensions.w * factor;
  const H = dimensions.h * factor;

  const currentSA =
    2 *
    (dimensions.l * dimensions.w +
      dimensions.w * dimensions.h +
      dimensions.h * dimensions.l);
  // Parse numeric price from possible string format (e.g. "₹150")
  const priceText = product?.price || "150";
  const numericBasePrice =
    typeof priceText === "string"
      ? parseFloat(priceText.replace(/[^0-9.]/g, ""))
      : priceText;
  const basePrice = isNaN(numericBasePrice) ? 150 : numericBasePrice;

  const calculatedUnitPrice = product
    ? (
      basePrice *
      (currentSA / 288) *
      (1 - Math.min(0.4, (quantity - 10) / 500))
    ).toFixed(2)
    : "0.00";

  // Reusable loading UI
  const LoadingScreen = ({ label = "Initializing Studio…" }) => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Soft glow */}
      <div className="absolute w-80 h-80 rounded-full bg-emerald-100 blur-3xl animate-pulse" />

      {/* Rings + logo */}
      <div className="relative flex items-center justify-center mb-10">
        <div
          className="absolute w-52 h-52 rounded-full border border-emerald-200 animate-spin"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute w-40 h-40 rounded-full border border-emerald-300 animate-spin"
          style={{ animationDuration: "5s", animationDirection: "reverse" }}
        />
        <div
          className="absolute w-28 h-28 rounded-full border-2 border-emerald-400 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-500"
            style={{
              transform: `rotate(${deg}deg) translateX(84px)`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0.4 + i * 0.1,
            }}
          />
        ))}
        <div className="relative z-10 w-24 h-24 rounded-2xl bg-white border border-emerald-100 shadow-xl flex items-center justify-center">
          <img
            src="/BOXFOX-1.png"
            alt="BOXFOX"
            className="w-16 object-contain"
          />
        </div>
      </div>

      {/* Brand label */}
      <div className="flex items-center gap-3 mb-1.5">
        <div className="w-8 h-px bg-emerald-400" />
        <p className="text-gray-950 font-black tracking-[0.6em] text-xs uppercase">
          BoxFox
        </p>
        <div className="w-8 h-px bg-emerald-400" />
      </div>
      <p className="text-emerald-500 text-[9px] font-bold tracking-[0.4em] uppercase mb-10">
        Design Studio
      </p>

      {/* Progress bar */}
      <div className="w-64 h-0.5 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          style={{ animation: "loadbar 2.2s ease-in-out forwards" }}
        />
      </div>

      {/* Cycling steps */}
      <div className="flex flex-col items-center gap-1.5">
        {["Initializing Studio…", "Loading Assets…", "Calibrating Forge…"].map(
          (step, i) => (
            <p
              key={step}
              className="text-gray-400 text-[9px] font-bold tracking-[0.3em] uppercase"
              style={{
                animation: `fadecycle 2.4s ease-in-out ${i * 0.7}s infinite`,
              }}
            >
              {step}
            </p>
          ),
        )}
      </div>
    </div>
  );

  if (loading || !product) return <MainLoadingScreen />;

  const faceStyle = (face) => ({
    backgroundImage: boxTextures[face] ? `url(${boxTextures[face]})` : "none",
    backgroundColor: boxColors[face] || "rgba(16, 185, 129, 0.05)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    transformStyle: "preserve-3d",
  });

  return (
    <div className="min-h-screen bg-white text-gray-950 selection:bg-emerald-500 selection:text-white font-sans overflow-x-hidden">
      {/* AI Generate overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Soft glow */}
            <div className="absolute w-80 h-80 rounded-full bg-emerald-100 blur-3xl animate-pulse" />

            {/* Rings + logo */}
            <div className="relative flex items-center justify-center mb-10">
              <div
                className="absolute w-52 h-52 rounded-full border border-emerald-200 animate-spin"
                style={{ animationDuration: "8s" }}
              />
              <div
                className="absolute w-40 h-40 rounded-full border border-emerald-300 animate-spin"
                style={{
                  animationDuration: "5s",
                  animationDirection: "reverse",
                }}
              />
              <div
                className="absolute w-28 h-28 rounded-full border-2 border-emerald-400 animate-spin"
                style={{ animationDuration: "3s" }}
              />
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-emerald-500"
                  style={{
                    transform: `rotate(${deg}deg) translateX(84px)`,
                    opacity: 0.4 + i * 0.1,
                  }}
                />
              ))}
              <div className="relative z-10 w-24 h-24 rounded-2xl bg-white border border-emerald-100 shadow-xl flex items-center justify-center">
                <img
                  src="/BOXFOX-1.png"
                  alt="BOXFOX"
                  className="w-16 object-contain"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-px bg-emerald-400" />
              <p className="text-gray-950 font-black tracking-[0.6em] text-xs uppercase">
                BoxFox
              </p>
              <div className="w-8 h-px bg-emerald-400" />
            </div>
            <p className="text-emerald-500 text-[9px] font-bold tracking-[0.4em] uppercase mb-10">
              AI Forge Active
            </p>

            <div className="w-64 h-0.5 bg-gray-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full animate-pulse"
                style={{ width: "100%" }}
              />
            </div>

            <div className="flex flex-col items-center gap-1.5">
              {[
                "Crafting your design…",
                "Running Neural Forge…",
                "Applying to box…",
              ].map((step, i) => (
                <p
                  key={step}
                  className="text-gray-400 text-[9px] font-bold tracking-[0.3em] uppercase"
                  style={{
                    animation: `fadecycle 2.4s ease-in-out ${i * 0.7}s infinite`,
                  }}
                >
                  {step}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />

      <main className="pt-20 sm:pt-24 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {/* 3D SPATIAL CANVAS (LEFT) */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div className="relative shrink-0">
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                  <Box size={16} className="text-emerald-500" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-[9px] sm:text-[11px] md:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-emerald-600 italic leading-none truncate">
                  Neural_Smart_Cube_XL
                </h2>
                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Master-Lab-Edition_2026
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex px-3 lg:px-4 py-2 bg-white rounded-xl border border-gray-100 items-center gap-2 lg:gap-3 shadow-sm">
                <RefreshCw
                  size={12}
                  className="animate-spin-slow text-emerald-500"
                />
                <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Core_Link_Stable
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>

          <div
            className="relative h-[42vh] sm:h-[52vh] md:h-[60vh] lg:h-[680px] xl:h-[780px] bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 rounded-2xl sm:rounded-[3rem] md:rounded-[4rem] lg:rounded-[5rem] border border-gray-200 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing group touch-none"
            onMouseDown={() => {
              isDragging.current = true;
            }}
            onMouseMove={(e) => {
              if (isDragging.current)
                setRotate((r) => ({
                  x: r.x - e.movementY * 0.4,
                  y: r.y + e.movementX * 0.4,
                }));
            }}
            onMouseUp={() => {
              isDragging.current = false;
            }}
            onMouseLeave={() => {
              isDragging.current = false;
            }}
            onTouchStart={(e) => {
              isDragging.current = true;
              prevTouch.current = e.touches[0];
            }}
            onTouchMove={(e) => {
              if (isDragging.current && e.touches[0]) {
                const touch = e.touches[0];
                const movementX =
                  touch.clientX - (prevTouch.current?.clientX || touch.clientX);
                const movementY =
                  touch.clientY - (prevTouch.current?.clientY || touch.clientY);
                setRotate((r) => ({
                  x: r.x - movementY * 0.5,
                  y: r.y + movementX * 0.5,
                }));
                prevTouch.current = touch;
              }
            }}
            onTouchEnd={() => {
              isDragging.current = false;
              prevTouch.current = null;
            }}
          >
            {/* Blueprint Grid Overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* 3D Blueprint Engine */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: "3000px" }}
            >
              <motion.div
                animate={{ rotateX: rotate.x, rotateY: rotate.y }}
                transition={{ type: "spring", damping: 30, stiffness: 100 }}
                style={{
                  transformStyle: "preserve-3d",
                  width: L,
                  height: H,
                  position: "relative",
                }}
              >
                {/* Faces */}
                <div
                  style={{
                    ...faceStyle("front"),
                    width: L,
                    height: H,
                    transform: `translateZ(${W / 2}px)`,
                  }}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50"
                >
                  {!boxTextures.front && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      Front_Panel
                    </div>
                  )}
                  {customText && (
                    <div
                      className={`absolute drop-shadow-2xl text-center px-4 ${textStyleMap[boxTextStyle]}`}
                      style={{
                        fontSize: `${H / 5}px`,
                        color: boxTextColor,
                        transform: "translateZ(2px)",
                      }}
                    >
                      {customText}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    ...faceStyle("back"),
                    width: L,
                    height: H,
                    transform: `rotateY(180deg) translateZ(${W / 2}px)`,
                  }}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50"
                >
                  {!boxTextures.back && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      Rear
                    </div>
                  )}
                </div>
                <div
                  style={{
                    ...faceStyle("right"),
                    width: W,
                    height: H,
                    transform: `rotateY(90deg) translateZ(${L / 2}px)`,
                    left: (L - W) / 2,
                  }}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50"
                >
                  {!boxTextures.right && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] rotate-[-90deg]">
                      Right
                    </div>
                  )}
                </div>
                <div
                  style={{
                    ...faceStyle("left"),
                    width: W,
                    height: H,
                    transform: `rotateY(-90deg) translateZ(${L / 2}px)`,
                    left: (L - W) / 2,
                  }}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50"
                >
                  {!boxTextures.left && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] rotate-[90deg]">
                      Left
                    </div>
                  )}
                </div>
                <div
                  style={{
                    ...faceStyle("top"),
                    width: L,
                    height: W,
                    transform: `rotateX(90deg) translateZ(${H / 2}px)`,
                    top: (H - W) / 2,
                  }}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50"
                >
                  {!boxTextures.top && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      Top_Header
                    </div>
                  )}
                  {customText && (
                    <div
                      className={`absolute drop-shadow-2xl text-center px-4 ${textStyleMap[boxTextStyle]}`}
                      style={{
                        fontSize: `${L / 12}px`,
                        color: boxTextColor,
                        transform: "translateZ(2px)",
                      }}
                    >
                      {customText}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    ...faceStyle("bottom"),
                    width: L,
                    height: W,
                    transform: `rotateX(-90deg) translateZ(${H / 2}px)`,
                    top: (H - W) / 2,
                  }}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50"
                >
                  {!boxTextures.bottom && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      base
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Layout Metadata */}
            <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 pointer-events-none">
              <div className="flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm">
                <Maximize2 size={13} className="text-emerald-500" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-700 italic">
                  Scale_Context_1:1
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 flex items-end justify-between pointer-events-none">
              <div className="space-y-2 sm:space-y-4">
                <div className="flex gap-4 sm:gap-6 md:gap-10">
                  {["l", "w", "h"].map((d) => (
                    <div key={d}>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] font-black text-emerald-600 uppercase mb-1 tracking-[0.3em] sm:tracking-[0.4em]">
                        {d}_DIM
                      </p>
                      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black italic text-gray-950 leading-none">
                        {dimensions[d]}
                        <span className="text-[10px] sm:text-xs not-italic ml-0.5 text-gray-500">
                          in
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-emerald-600 text-[7px] sm:text-[8px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Real-time Rendering Active
                </div>
              </div>
              <div className="group pointer-events-auto cursor-pointer flex flex-col items-center gap-1.5 sm:gap-2 bg-white/95 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-lg backdrop-blur-md active:scale-90 transition-all duration-300">
                <RotateCw
                  size={18}
                  className="text-gray-950 group-hover:rotate-180 transition-transform duration-700"
                />
                <span className="text-[6px] sm:text-[7px] font-black text-gray-400 uppercase tracking-[0.4em]">
                  Drag_to_Inspect
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROL PANEL (RIGHT) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 h-fit lg:sticky lg:top-24">
          <div className="bg-gray-50 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] p-5 sm:p-7 md:p-9 lg:p-10 border border-gray-100 shadow-sm space-y-6 sm:space-y-8 md:space-y-10 relative overflow-hidden">
            {/* Section 1: Geometry */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Layers size={13} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-950 italic leading-none">
                    Structural_Config
                  </h3>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest italic flex items-center gap-1.5 sm:gap-2">
                  <Shield size={9} /> B2B_Only
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {[
                  { id: "mailers", label: "Structural Mailers (3-Ply)" },
                  {
                    id: "confectionary",
                    label: "Confectionary Lab (Food Grade)",
                  },
                  { id: "pizza", label: "Kinetic Pizza Nodes" },
                  { id: "luxury", label: "Luxury Substrates (UV/Foil)" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setBoxMode(type.id)}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest transition-all text-center leading-tight ${boxMode === type.id
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                      : "bg-white text-gray-500 border-gray-200 hover:border-emerald-400 hover:text-gray-950"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-5 sm:pt-6 md:pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Ruler size={13} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-950 italic leading-none">
                    Geometry_Core
                  </h3>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
                  Standard_Units (IN)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {["l", "w", "h"].map((d) => (
                  <div key={d} className="space-y-2 sm:space-y-3">
                    <input
                      type="number"
                      value={dimensions[d]}
                      onChange={(e) =>
                        setDimensions({
                          ...dimensions,
                          [d]: Math.max(1, parseFloat(e.target.value) || 1),
                        })
                      }
                      className="w-full h-14 sm:h-16 md:h-18 lg:h-20 bg-white border border-gray-200 rounded-2xl sm:rounded-[1.5rem] md:rounded-[1.8rem] px-2 sm:px-4 text-xl sm:text-2xl font-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-sm text-center text-gray-950"
                    />
                    <p className="text-[10px] sm:text-xs font-black text-gray-600 uppercase tracking-widest text-center">
                      {d === "l" ? "Length" : d === "w" ? "Width" : "Height"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Asset Library */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8 pt-5 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex p-1 sm:p-1.5 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm w-full sm:w-auto">
                  <button
                    onClick={() => setCustomMode("texture")}
                    className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-90 ${customMode === "texture"
                      ? "bg-gray-950 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-950"
                      }`}
                  >
                    Neural_Maps
                  </button>
                  <button
                    onClick={() => setCustomMode("color")}
                    className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-90 ${customMode === "color"
                      ? "bg-gray-950 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-950"
                      }`}
                  >
                    Solid_Lab
                  </button>
                </div>
              </div>

              {customMode === "texture" ? (
                <div className="grid grid-cols-4 gap-4">
                  <label className="aspect-square border-2 border-dashed border-gray-200 bg-white rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-all group overflow-hidden">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Plus
                      size={28}
                      className="text-gray-300 group-hover:text-emerald-500 group-hover:scale-125 transition-all"
                    />
                  </label>
                  {assetPool.map((asset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveAssetIndex(idx)}
                      className={`relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all ${activeAssetIndex === idx ? "border-emerald-500 scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"}`}
                    >
                      <img src={asset} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-3">
                  {[
                    "#000000",
                    "#FFFFFF",
                    "#059669",
                    "#1D4ED8",
                    "#B91C1C",
                    "#D97706",
                    "#7C3AED",
                    "#DB2777",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setActiveColor(color)}
                      style={{ backgroundColor: color }}
                      className={`aspect-square rounded-2xl border-2 transition-all ${activeColor === color ? "border-emerald-500 scale-90 ring-4 ring-emerald-500/10 shadow-lg" : "border-gray-100 hover:border-emerald-500/40"}`}
                    />
                  ))}
                  <div className="aspect-square rounded-2xl bg-white border border-gray-100 flex items-center justify-center relative group overflow-hidden">
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => setActiveColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer scale-[5]"
                    />
                    <Palette
                      size={16}
                      className="text-gray-400 group-hover:text-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {(assetPool.length > 0 || customMode === "color") && (
                <div className="space-y-4 sm:space-y-5 bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-4 sm:p-6 md:p-7 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-950 uppercase tracking-[0.2em] sm:tracking-[0.3em] italic">
                      Face_Mapping_Active
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={applyToAllFaces}
                        className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-90"
                      >
                        All
                      </button>
                      <button
                        onClick={clearAllFaces}
                        className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-400 transition-all active:scale-90"
                      >
                        Clear
                      </button>
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {["front", "back", "left", "right", "top", "bottom"].map(
                      (face) => (
                        <button
                          key={face}
                          onClick={() => toggleFaceMapping(face)}
                          className={`py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all border active:scale-90 ${(customMode === "texture" &&
                            boxTextures[face] ===
                            assetPool[activeAssetIndex] &&
                            boxTextures[face]) ||
                            (customMode === "color" &&
                              boxColors[face] === activeColor)
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-400 hover:text-gray-950"
                            }`}
                        >
                          {face}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Neural AI Forge */}
            <div className="space-y-4 sm:space-y-5 pt-5 sm:pt-6 border-t border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sparkles size={16} className="text-emerald-500" />
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-950 italic">
                    AI_Texture_Forge
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedChips.length > 0 && (
                    <button
                      onClick={() => setSelectedChips([])}
                      className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-400 transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-emerald-100 text-emerald-700 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black border border-emerald-200 tracking-widest">
                    NEURAL_V2.5
                  </div>
                </div>
              </div>

              {/* Style Quick-Pick Tabs */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100">
                  {Object.keys(chipCategories).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveChipCategory(cat)}
                      className={`flex-1 py-2 sm:py-2.5 text-[7px] sm:text-[8px] font-black uppercase tracking-widest transition-all ${activeChipCategory === cat
                        ? "bg-gray-950 text-white"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="p-3 sm:p-4 flex flex-wrap gap-1.5 sm:gap-2">
                  {chipCategories[activeChipCategory].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => toggleChip(chip)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[8px] sm:text-[9px] font-bold border transition-all active:scale-95 ${selectedChips.includes(chip)
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                        }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Describe Your Idea */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white overflow-hidden shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 bg-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Sparkles size={11} className="text-white" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-blue-700">
                      Your Idea
                    </p>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-500 text-[7px] font-bold uppercase tracking-widest">
                      Optional
                    </span>
                  </div>
                  <button
                    onClick={enhancePrompt}
                    disabled={!aiPrompt.trim() || isEnhancing}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all active:scale-90 ${!aiPrompt.trim() || isEnhancing
                      ? "bg-blue-100 text-blue-300 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                      }`}
                  >
                    {isEnhancing ? (
                      <>
                        <RefreshCw size={10} className="animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Zap size={10} />
                        AI Enhance
                      </>
                    )}
                  </button>
                </div>
                {/* Textarea */}
                <div className="p-3 sm:p-4">
                  <textarea
                    placeholder={`Describe your box design... (e.g. "minimalist white mailer with gold foil logo and clean typography")`}
                    value={aiPrompt}
                    onChange={(e) => {
                      setAiPrompt(e.target.value);
                      setIsPromptEnhanced(false);
                    }}
                    rows={3}
                    className="w-full bg-white border border-blue-100 rounded-xl p-3 sm:p-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 outline-none resize-none transition-all"
                  />
                  {aiPrompt.trim() && (
                    <button
                      onClick={() => {
                        setAiPrompt("");
                        setIsPromptEnhanced(false);
                      }}
                      className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-blue-300 hover:text-red-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Smart Prompt Preview */}
              {(aiPrompt.trim() || selectedChips.length > 0) && (
                <div className="rounded-xl sm:rounded-2xl border border-emerald-100 bg-emerald-50/60 overflow-hidden">
                  <button
                    onClick={() => setShowSmartPreview((v) => !v)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-700"
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap size={11} /> Smart Prompt Preview
                    </span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-300 ${showSmartPreview ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showSmartPreview && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      <p className="text-[9px] sm:text-[10px] text-emerald-800 leading-relaxed font-medium italic bg-white/70 rounded-xl p-3 border border-emerald-100">
                        {buildSmartPrompt()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Text on Box Toggle */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setTextOnBox((v) => !v)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Type
                      size={14}
                      className={
                        textOnBox ? "text-emerald-500" : "text-gray-300"
                      }
                    />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-gray-700">
                      Brand Text on Box
                    </span>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full transition-all duration-300 relative ${textOnBox ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${textOnBox ? "left-[1.15rem]" : "left-0.5"
                        }`}
                    />
                  </div>
                </button>

                {textOnBox && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 sm:space-y-4 border-t border-gray-50 pt-3">
                    <input
                      type="text"
                      placeholder="Your brand / text..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm font-semibold text-gray-950 placeholder:text-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                    />

                    {/* Text Style */}
                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Text Style
                      </p>
                      <div className="flex gap-2">
                        {[
                          { id: "bold", label: "Bold", preview: "font-black" },
                          {
                            id: "script",
                            label: "Script",
                            preview: "italic font-semibold",
                          },
                          {
                            id: "minimal",
                            label: "Minimal",
                            preview: "font-light tracking-widest",
                          },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setBoxTextStyle(s.id)}
                            className={`flex-1 py-2 sm:py-2.5 rounded-xl text-[9px] border transition-all ${boxTextStyle === s.id
                              ? "bg-gray-950 text-white border-gray-950 shadow-md"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                              } ${s.preview}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Text Color
                      </p>
                      <div className="flex gap-2 items-center">
                        {[
                          "#FFFFFF",
                          "#000000",
                          "#059669",
                          "#F59E0B",
                          "#EF4444",
                          "#6366F1",
                        ].map((c) => (
                          <button
                            key={c}
                            onClick={() => setBoxTextColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${boxTextColor === c
                              ? "border-emerald-500 scale-90 ring-2 ring-emerald-500/20 shadow-md"
                              : "border-gray-200 hover:border-gray-400"
                              }`}
                          />
                        ))}
                        <div className="relative ml-auto">
                          <input
                            type="color"
                            value={boxTextColor}
                            onChange={(e) => setBoxTextColor(e.target.value)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer opacity-0 absolute inset-0"
                          />
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Palette size={12} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={async () => {
                  if (
                    (!aiPrompt && selectedChips.length === 0) ||
                    !window.puter
                  )
                    return;
                  setIsGenerating(true);
                  try {
                    const finalPrompt = buildSmartPrompt();
                    const img = await window.puter.ai.txt2img(finalPrompt);
                    smartApplyAI(img.src);
                  } catch (err) {
                    console.error("Forge Error:", err);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={
                  isGenerating ||
                  (!aiPrompt.trim() && selectedChips.length === 0)
                }
                className="w-full py-4 sm:py-5 md:py-6 bg-gray-950 text-white rounded-xl sm:rounded-2xl font-black uppercase text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.45em] flex items-center justify-center gap-3 sm:gap-4 hover:bg-emerald-500 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin shrink-0" size={18} />
                    <span>Generating Design...</span>
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={17}
                      className="group-hover:rotate-12 transition-transform shrink-0"
                    />
                    <span>Ignite_Forge</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Control */}
          <div className="bg-emerald-500 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] p-5 sm:p-7 md:p-8 lg:p-10 text-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-[0_20px_60px_rgba(16,185,129,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/25 to-transparent pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] leading-none opacity-60 text-black">
                Unit_Price_Pro_Rate
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-black leading-none">
                ₹{calculatedUnitPrice}
              </h2>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              className="w-full sm:w-auto py-4 sm:h-16 md:h-20 px-6 sm:px-8 md:px-12 bg-black text-white rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] flex items-center justify-center gap-3 sm:gap-4 hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 relative z-10 group shrink-0"
            >
              <ShoppingCart
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Add_to_Basket
            </button>
          </div>
        </div>
      </main >

      <><Footer /><style jsx global>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes loadbar {
          0% {
            width: 0%;
          }
          40% {
            width: 55%;
          }
          70% {
            width: 80%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes fadecycle {
          0%,
          100% {
            opacity: 0;
            transform: translateY(4px);
          }
          30%,
          70% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      `}</style></>
    </div >
  );
}

// Reusable loading UI
const MainLoadingScreen = ({ label = "Initializing Studio…" }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    {/* Soft glow */}
    <div className="absolute w-80 h-80 rounded-full bg-emerald-100 blur-3xl animate-pulse" />

    {/* Rings + logo */}
    <div className="relative flex items-center justify-center mb-10">
      <div
        className="absolute w-52 h-52 rounded-full border border-emerald-200 animate-spin"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute w-40 h-40 rounded-full border border-emerald-300 animate-spin"
        style={{ animationDuration: "5s", animationDirection: "reverse" }}
      />
      <div
        className="absolute w-28 h-28 rounded-full border-2 border-emerald-400 animate-spin"
        style={{ animationDuration: "3s" }}
      />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-emerald-500"
          style={{
            transform: `rotate(${deg}deg) translateX(84px)`,
            animationDelay: `${i * 0.15}s`,
            opacity: 0.4 + i * 0.1,
          }}
        />
      ))}
      <div className="relative z-10 w-24 h-24 rounded-2xl bg-white border border-emerald-100 shadow-xl flex items-center justify-center">
        <img
          src="/BOXFOX-1.png"
          alt="BOXFOX"
          className="w-16 object-contain"
        />
      </div>
    </div>

    {/* Brand label */}
    <div className="flex items-center gap-3 mb-1.5">
      <div className="w-8 h-px bg-emerald-400" />
      <p className="text-gray-950 font-black tracking-[0.6em] text-xs uppercase">
        BoxFox
      </p>
      <div className="w-8 h-px bg-emerald-400" />
    </div>
    <p className="text-emerald-500 text-[9px] font-bold tracking-[0.4em] uppercase mb-10">
      Design Studio
    </p>

    {/* Progress bar */}
    <div className="w-64 h-0.5 bg-gray-100 rounded-full overflow-hidden mb-5">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
        style={{ animation: "loadbar 2.2s ease-in-out forwards" }}
      />
    </div>

    {/* Cycling steps */}
    <div className="flex flex-col items-center gap-1.5">
      {["Initializing Studio…", "Loading Assets…", "Calibrating Forge…"].map(
        (step, i) => (
          <p
            key={step}
            className="text-gray-400 text-[9px] font-bold tracking-[0.3em] uppercase"
            style={{
              animation: `fadecycle 2.4s ease-in-out ${i * 0.7}s infinite`,
            }}
          >
            {step}
          </p>
        ),
      ) || null}
    </div>
  </div>
);

export default function StandaloneCustomizePage() {
  return (
    <Suspense fallback={<MainLoadingScreen />}>
      <CustomizeLabContent />
    </Suspense>
  );
}
