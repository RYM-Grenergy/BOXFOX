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
  X,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Share2,
  Link2,
  Copy,
  Star,
  Lock,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import AuthModal from "@/app/components/AuthModal";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import Script from "next/script";
import Cropper from 'react-easy-crop';
import { downloadDieLine } from "@/lib/dieline-generator";

function CustomizeLabContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user, loading: authLoading, checkUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    }
  }, [user, authLoading, router]);

  // Default Product ID for the Standalone Lab
  const DEFAULT_PRODUCT_ID = "1771670990303";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(10);
  const [viewMode, setViewMode] = useState("2D");

  // Customization States
  const [dimensions, setDimensions] = useState({ l: 12, w: 8, h: 4 });
  const [isGenerating, setIsGenerating] = useState(false);
  // Custom formula states
  const [selectedGSM, setSelectedGSM] = useState("300 GSM");
  const [selectedMaterial, setSelectedMaterial] = useState("SBS");

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [logoPrompt, setLogoPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPromptEnhanced, setIsPromptEnhanced] = useState(false);
  const [customText, setCustomText] = useState("");
  const [unit, setUnit] = useState("in"); // "in" or "mm"
  const [designName, setDesignName] = useState("Untitled Design");
  const [activeDesignId, setActiveDesignId] = useState(null);

  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // AI Forge: Smart Prompt Builder
  const [selectedChips, setSelectedChips] = useState([]);
  const [activeChipCategory, setActiveChipCategory] = useState("style");
  const [showSmartPreview, setShowSmartPreview] = useState(false);

  // Text-on-Box options
  const [textOnBox, setTextOnBox] = useState(false);
  const [boxTextColor, setBoxTextColor] = useState("#FFFFFF");
  const [boxTextStyle, setBoxTextStyle] = useState("bold");
  const [boxTextSettings, setBoxTextSettings] = useState({ x: 50, y: 50, size: 20 });

  // Neural Multi-Asset Pool (Max 3)
  const [assetPool, setAssetPool] = useState([]);
  const [savedPatterns, setSavedPatterns] = useState([]);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  // Brand Vault State
  const [brandVault, setBrandVault] = useState({ logos: [], colors: [], fonts: [] });

  // Sync brand vault from server
  useEffect(() => {
    if (user) {
      fetch('/api/user/brand-vault')
        .then(res => res.json())
        .then(data => {
          if (data.brandVault) setBrandVault(data.brandVault);
        })
        .catch(err => console.error("Vault Sync Error:", err));
    }
  }, [user]);

  const saveToVault = async (type, value, name) => {
    try {
      const res = await fetch('/api/user/brand-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value, name })
      });
      const data = await res.json();
      if (data.success) {
        setBrandVault(data.brandVault);
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} secured in vault!`);
      }
    } catch (e) {
      console.error("Vault Save Error:", e);
      showToast("Failed to save to vault", "error");
    }
  };

  const deleteFromVault = async (type, value) => {
    try {
      const res = await fetch(`/api/user/brand-vault?type=${type}&value=${encodeURIComponent(value)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setBrandVault(data.brandVault);
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} removed from vault.`);
      }
    } catch (e) { console.error(e); }
  };

  // Sync saved patterns from user object
  useEffect(() => {
    if (user?.aiPatterns) {
      // Sort by newest first and limit to recent 12 for the UI
      const patterns = [...user.aiPatterns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSavedPatterns(patterns);
    }
  }, [user]);
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
  const [textureSettings, setTextureSettings] = useState({
    front: { scale: 100, x: 50, y: 50 },
    back: { scale: 100, x: 50, y: 50 },
    top: { scale: 100, x: 50, y: 50 },
    bottom: { scale: 100, x: 50, y: 50 },
    left: { scale: 100, x: 50, y: 50 },
    right: { scale: 100, x: 50, y: 50 },
  });
  const [selectedFace, setSelectedFace] = useState(null);
  const [activeColor, setActiveColor] = useState("#059669");
  const [customMode, setCustomMode] = useState("texture"); // 'texture', 'color', or 'logo'
  const [boxMode, setBoxMode] = useState("mailers"); // B2B Box types

  // Logo States
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [boxLogos, setBoxLogos] = useState({
    front: null,
    back: null,
    top: null,
    bottom: null,
    left: null,
    right: null,
  });
  const [logoSettings, setLogoSettings] = useState({
    front: { scale: 30, x: 50, y: 50, rotate: 0 },
    back: { scale: 30, x: 50, y: 50, rotate: 0 },
    top: { scale: 30, x: 50, y: 50, rotate: 0 },
    bottom: { scale: 30, x: 50, y: 50, rotate: 0 },
    left: { scale: 30, x: 50, y: 50, rotate: 0 },
    right: { scale: 30, x: 50, y: 50, rotate: 0 },
  });

  // Rotation State
  const [rotate, setRotate] = useState({ x: -20, y: 45 });
  const isDragging = useRef(false);
  const prevTouch = useRef(null);

  // Crop States
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isSpatialPanning = useRef(false);
  const lastSpatialMouse = useRef({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    // Detect mobile/small screen for 3D Experience notification
    if (window.innerWidth < 1024) {
      setShowMobileWarning(true);
    }
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return canvas.toDataURL('image/jpeg');
  }

  useEffect(() => {
    // Sync dimensions from URL if present
    const l = searchParams.get('length');
    const w = searchParams.get('width');
    const h = searchParams.get('height');
    const u = searchParams.get('unit');
    const urlId = searchParams.get('id');

    if (l || w || h) {
      setDimensions({
        l: parseFloat(l) || dimensions.l,
        w: parseFloat(w) || dimensions.w,
        h: parseFloat(h) || dimensions.h
      });
    }

    if (u) {
      setUnit(u.toLowerCase() === 'mm' ? 'mm' : 'in');
    }

    const prevName = searchParams.get('name');
    const designId = searchParams.get('designId');
    if (prevName) setDesignName(prevName);
    if (designId) setActiveDesignId(designId);

    const loadProduct = async () => {
      setLoading(true);
      try {
        let targetId = urlId || DEFAULT_PRODUCT_ID;

        // Phase 1: Try fetching the specific ID
        let res = await fetch(`/api/products/${targetId}`);
        let data = await res.json();

        // Phase 2: If fail, fetch the first available product as fallback
        if (data.error || !data) {
          console.warn("Target product not found, fetching fallback...");
          const allRes = await fetch('/api/products?admin=true');
          const allData = await allRes.json();
          if (Array.isArray(allData) && allData.length > 0) {
            // Pick the first available product
            res = await fetch(`/api/products/${allData[0].id}`);
            data = await res.json();
          }
        }

        if (data && !data.error) {
          setProduct(data);
          setQuantity(data.minOrderQuantity || 10);

          // Sync dimensions if not already set by URL params
          if (!l && !w && !h && data.dimensions) {
            setDimensions({
              l: data.dimensions.length || 12,
              w: data.dimensions.width || 8,
              h: data.dimensions.height || 4
            });
            if (data.dimensions.unit) {
              setUnit(data.dimensions.unit.toLowerCase() === 'mm' ? 'mm' : 'in');
            }
          }
        } else {
          console.error("Customize Lab: No products available in system");
        }

        // Restore reorder design from sessionStorage if present
        const isReorder = searchParams.get('reorder');
        if (isReorder === 'true') {
          try {
            const savedDesign = sessionStorage.getItem('boxfox_reorder');
            if (savedDesign) {
              const cd = JSON.parse(savedDesign);
              // Restore textures
              if (cd.textures) {
                setBoxTextures(cd.textures);
                // Add unique textures to asset pool
                const uniqueTextures = [...new Set(Object.values(cd.textures).filter(Boolean))];
                setAssetPool(uniqueTextures.slice(0, 3));
                if (uniqueTextures.length > 0) setActiveAssetIndex(0);
              }
              // Restore colors
              if (cd.colors) setBoxColors(cd.colors);
              // Restore texture settings
              if (cd.textureSettings) setTextureSettings(cd.textureSettings);
              // Restore text
              if (cd.text) {
                setCustomText(cd.text);
                setTextOnBox(true);
              }
              if (cd.textStyle) setBoxTextStyle(cd.textStyle);
              if (cd.textColor) setBoxTextColor(cd.textColor);
              if (cd.textSettings) setBoxTextSettings(cd.textSettings);
              // Clean up so it doesn't restore again on page refresh
              sessionStorage.removeItem('boxfox_reorder');
              console.log("Customize Lab: Reorder design restored successfully");
            }
          } catch (e) {
            console.error("Failed to restore reorder design:", e);
          }
        }
      } catch (err) {
        console.error("Customize Lab: Initialization Error", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [searchParams]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageSrc = reader.result;
        setImageToCrop(imageSrc);

        // Add original to pool immediately so they don't have to wait for crop to see it
        setAssetPool((prev) => {
          const updated = [...prev, imageSrc].slice(-3);
          setActiveAssetIndex(updated.length - 1);
          return updated;
        });

        // Automatically apply to front if it's the first asset or for immediate feedback
        setBoxTextures((prev) => ({ ...prev, front: imageSrc }));

        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct Spatial Interaction Logic
  const handleFaceSpatialDown = (e, face) => {
    if (selectedFace !== face || !boxTextures[face]) return;
    isSpatialPanning.current = true;
    lastSpatialMouse.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };

  const handleFaceSpatialMove = (e, face) => {
    if (!isSpatialPanning.current || selectedFace !== face) return;

    const dx = (e.clientX - lastSpatialMouse.current.x) * 0.2;
    const dy = (e.clientY - lastSpatialMouse.current.y) * 0.2;

    setTextureSettings(prev => ({
      ...prev,
      [face]: {
        ...prev[face],
        x: Math.min(100, Math.max(0, prev[face].x + dx)),
        y: Math.min(100, Math.max(0, prev[face].y + dy))
      }
    }));

    lastSpatialMouse.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };

  const handleFaceSpatialScroll = (e, face) => {
    if (selectedFace !== face || !boxTextures[face]) return;
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -5 : 5;
    setTextureSettings(prev => ({
      ...prev,
      [face]: {
        ...prev[face],
        scale: Math.min(400, Math.max(10, prev[face].scale + delta))
      }
    }));
  };

  const stopSpatialPanning = () => {
    isSpatialPanning.current = false;
  };

  useEffect(() => {
    window.addEventListener("mouseup", stopSpatialPanning);
    return () => window.removeEventListener("mouseup", stopSpatialPanning);
  }, []);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const finalizeCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);

      // Update the asset in the pool at the active index (which was just added in handleFileUpload)
      setAssetPool((prev) => {
        const updated = [...prev];
        updated[activeAssetIndex] = croppedImage;
        return updated;
      });

      // Update all faces currently using the original with the cropped version
      setBoxTextures((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach(face => {
          if (updated[face] === imageToCrop) {
            updated[face] = croppedImage;
          }
        });
        return updated;
      });

      setShowCropModal(false);
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
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

  const generateAILogo = async (logoPrompt) => {
    if (!logoPrompt.trim()) return;
    setIsGeneratingLogo(true);
    try {
      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: logoPrompt,
          style: selectedChips.join(', '),
          color: activeColor
        })
      });
      const data = await res.json();
      if (data.url) {
        setBoxLogos(prev => ({ ...prev, [selectedFace || 'top']: data.url }));
        showToast("AI Logo Generated and Applied!");
      } else {
        showToast(data.error || "Logo generation failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred during AI logo generation", "error");
    } finally {
      setIsGeneratingLogo(false);
    }
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
    history: [], // Mark as special category
  };

  const toggleChip = (chip) =>
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );

  const enhancePrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsEnhancing(true);
    // Note: AI Enhance is temporarily offline while migrating to the new engine.
    // We'll keep the logic as a fallback for the user's raw prompt.
    setTimeout(() => {
      setIsEnhancing(false);
      setIsPromptEnhanced(true);
    }, 1000);
  };

  const buildSmartPrompt = () => {
    // If the prompt was AI-enhanced, use it directly as a base
    let basePrompt = aiPrompt.trim();

    const themeMap = {
      mailers: "e-commerce and logistics theme",
      confectionary: "artisan confectionery and bakery motif",
      pizza: "gourmet Italian culinary aesthetic",
      luxury: "bespoke luxury branding",
    };

    const targetTheme = themeMap[boxMode] || "professional product branding";

    // Core technical quality strings for Flux Dev - Focusing on FLAT GRAPHICS ONLY
    const qualityBoosters = "pure flat 2D graphic pattern, seamless surface texture, edge-to-edge wallpaper style, hi-res vector art aesthetic, no 3D objects, no shadows, no perspective, no physical box, isolated graphic";

    // Style-specific modifiers - Abstract and Texture focused
    const styleModifiers = {
      "Luxury Premium": "gold foil embossed motifs, matte black velvet texture, sophisticated repeating geometric patterns, royal aesthetic layout",
      "Eco & Sustainable": "recycled craft paper fiber texture, organic earth-toned leaf patterns, plant-based ink aesthetic, minimalist botanical line art motifs",
      "Bold & Playful": "vibrant pop-art patterns, high contrast color blocks, energetic geometric repeating shapes, modern typography art layout",
      "Minimal & Clean": "bauhaus style graphics, swiss design symmetry, ample negative space, clean grid-based texture, monochromatic surface",
      "Festive & Celebratory": "sparkling metallic pattern motifs, celebratory decorative elements, warm glow accents, intricate festive line work",
      "Professional Corporate": "clean corporate branding grid, blue and silver geometric motifs, organizational surface symmetry",
      "Modern High-End": "glassmorphism texture layers, futuristic circuit patterns, sleek carbon fiber weave aesthetic, ultra-modern UI-style graphic",
    };

    let selectedStyleDetail = "";
    selectedChips.forEach(chip => {
      if (styleModifiers[chip]) selectedStyleDetail += styleModifiers[chip] + ", ";
    });

    const promptParts = [
      `A seamless flat 2D surface texture pattern`,
      targetTheme,
      basePrompt ? `featuring ${basePrompt}` : "with professional graphic motifs",
      selectedStyleDetail,
      "purely 2D flat design, (ABSOLUTELY NO 3D BOX, NO PHYSICAL OBJECTS)",
      qualityBoosters,
      "color-accurate full-frame graphic"
    ].filter(Boolean);

    return promptParts.join(", ");
  };

  const textStyleMap = {
    bold: "font-black tracking-widest text-center uppercase",
    script: "font-serif italic tracking-wide text-center",
    minimal: "font-light tracking-[0.5em] uppercase text-center",
    classic: "font-serif tracking-normal text-center",
    modern: "font-extralight tracking-[0.2em] text-center",
  };

  const maxVal = Math.max(dimensions.l, dimensions.w, dimensions.h);
  const factor = 320 / maxVal;
  const L = dimensions.l * factor;
  const W = dimensions.w * factor;
  const H = dimensions.h * factor;

  const getInches = (val) => unit === "mm" ? val / 25.4 : val;
  const fromInches = (val) => unit === "mm" ? val * 25.4 : val;

  const dimInInches = {
    l: getInches(dimensions.l),
    w: getInches(dimensions.w),
    h: getInches(dimensions.h)
  };

  const currentSA =
    2 *
    (dimInInches.l * dimInInches.w +
      dimInInches.w * dimInInches.h +
      dimInInches.h * dimInInches.l);
  // Parse numeric base price
  const priceText = product?.price || "150";
  const basePrice = typeof priceText === "string" ? parseFloat(priceText.replace(/[^0-9.]/g, "")) || 150 : (priceText || 150);

  // Apply User's Custom Practical Pricing Formula
  const minPrice = typeof product?.minPrice === 'number' ? product.minPrice : parseFloat(String(product?.minPrice || basePrice).replace(/[^0-9.]/g, '')) || basePrice;
  const maxPrice = typeof product?.maxPrice === 'number' ? product.maxPrice : parseFloat(String(product?.maxPrice || basePrice).replace(/[^0-9.]/g, '')) || basePrice;

  const diff = maxPrice - minPrice;
  let unitPriceVal = maxPrice;

  if (quantity >= 5000) unitPriceVal = minPrice;
  else if (quantity >= 1000) unitPriceVal = maxPrice - (diff * 0.4651);
  else if (quantity >= 500) unitPriceVal = maxPrice - (diff * 0.4205);
  else if (quantity >= 100) unitPriceVal = maxPrice - (diff * 0.3364);
  else if (quantity >= 50) unitPriceVal = maxPrice - (diff * 0.1682);
  else if (quantity >= 30) unitPriceVal = maxPrice - (diff * 0.10);
  else if (quantity >= 20) unitPriceVal = maxPrice - (diff * 0.05);
  else unitPriceVal = maxPrice;

  // Enhance base logic with practical formulas from Excel customization
  let addonPrice = 0;
  // GSM
  if (selectedGSM === "300 GSM") addonPrice += 2.5;
  if (selectedGSM === "350 GSM") addonPrice += 4.5;
  if (selectedGSM === "400 GSM") addonPrice += 6.5;

  // Material
  if (selectedMaterial === "Art Card") addonPrice += 2.0;
  if (selectedMaterial === "Custom Paper") addonPrice += 5.0;

  unitPriceVal += addonPrice;

  const calculatedUnitPrice = product
    ? (unitPriceVal * (currentSA / 288)).toFixed(2)
    : "0.00";

  // Auto-Sync background worker (Live Auto Share)
  useEffect(() => {
    // Only invoke background auto-saves if we have explicitly established an active share link/design ID.
    if (!shareLink && !activeDesignId) return;

    const autoSyncTimer = setTimeout(async () => {
      try {
        const designData = {
          name: designName || `${user?.name || 'My'} Design - ${dimensions.l}×${dimensions.w}×${dimensions.h}`,
          customDesign: {
            textures: boxTextures,
            colors: boxColors,
            textureSettings,
            text: customText,
            textStyle: boxTextStyle,
            textColor: boxTextColor,
            textSettings: boxTextSettings,
            dimensions,
            unit,
            selectedGSM,
            selectedMaterial
          },
          productId: product?.id,
          isPublic: true,
        };

        await fetch('/api/designs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...designData, designId: activeDesignId })
        });

      } catch (err) {
        console.warn("Background auto-save failed quietly: ", err);
      }
    }, 1200); // 1.2s Debounce

    return () => clearTimeout(autoSyncTimer);
  }, [
    dimensions, unit,
    selectedGSM, selectedMaterial,
    boxColors, customText, boxTextStyle, boxTextColor, boxTextSettings, textureSettings,
    shareLink, activeDesignId
  ]);

  // Reusable loading UI matching the premium Brand Loader
  const LoadingScreen = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: "blur(15px)" }}
        animate={{ scale: [0.8, 1.1, 1.0], opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-emerald-500/10 border border-emerald-50/50 p-16">
          <img src="/BOXFOX-1.png" alt="BOXFOX" className="w-64 object-contain" />
          <motion.div
            initial={{ x: "-150%", skewX: -25 }}
            animate={{ x: "150%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none"
          />
        </div>
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl -z-10 animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)" }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-12 text-[10px] font-black tracking-[0.4em] uppercase text-emerald-500"
      >
        Initializing Forge
      </motion.p>
    </div>
  );

  if ((loading || authLoading || !product) && !isGenerating) return <LoadingScreen />;

  const renderFaceLogo = (face) => {
    if (!boxLogos[face]) return null;
    const settings = logoSettings[face] || { scale: 30, x: 50, y: 50, rotate: 0 };
    return (
      <div
        className="absolute pointer-events-none drop-shadow-xl"
        style={{
          left: `${settings.x}%`,
          top: `${settings.y}%`,
          width: `${settings.scale}%`,
          transform: `translate(-50%, -50%) rotate(${settings.rotate}deg) translateZ(1px)`,
          zIndex: 20
        }}
      >
        <img src={boxLogos[face]} alt={`${face} logo`} className="w-full h-auto object-contain" />
      </div>
    );
  };

  const faceStyle = (face) => {
    const settings = textureSettings[face] || { scale: 100, x: 50, y: 50 };
    const isActive = selectedFace === face;
    return {
      backgroundImage: boxTextures[face] ? `url(${boxTextures[face]})` : "none",
      backgroundColor: boxColors[face] || "rgba(16, 185, 129, 0.05)",
      backgroundSize: boxTextures[face] ? `${settings.scale}%` : "cover",
      backgroundPosition: `${settings.x}% ${settings.y}%`,
      backgroundRepeat: "no-repeat",
      transition: isSpatialPanning.current ? "none" : "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      transformStyle: "preserve-3d",
      cursor: boxTextures[face] ? (isActive ? "move" : "crosshair") : "pointer",
      boxShadow: isActive ? "inset 0 0 0 4px #10b981, 0 0 40px rgba(16, 185, 129, 0.2)" : "none",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-white text-gray-950 selection:bg-emerald-500 selection:text-white font-sans"
    >
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => router.push('/')}
      />
      {/* AI Generate overlay removed for direct lab flow */}
      <main className="pt-20 sm:pt-24 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {/* 3D SPATIAL CANVAS (LEFT) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] flex flex-col space-y-4 md:space-y-6 overflow-y-auto no-scrollbar pb-6">
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-[2rem] shadow-sm shrink-0">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <div className="relative shrink-0">
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                  <Box size={16} className="text-emerald-500" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <input
                  type="text"
                  placeholder={product?.name || "Untitled Design"}
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  className="bg-transparent border-none outline-none text-[9px] sm:text-[11px] md:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-emerald-600 italic leading-none w-full focus:ring-0"
                />
                <h1 className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Product_Type: {product?.categories?.[1] || "Standard"} Lab Edition
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Save Draft */}
              <button
                disabled={isSavingDraft}
                onClick={async () => {
                  if (isSavingDraft) return;

                  const savedNamePrompt = window.prompt("Please enter a name to save your design as:", designName || product?.name || "Untitled Design");
                  if (savedNamePrompt === null) {
                    return; // user cancelled the save
                  }

                  setDesignName(savedNamePrompt);

                  setIsSavingDraft(true);
                  try {
                    const uploadedTextures = { ...boxTextures };
                    for (let face of Object.keys(uploadedTextures)) {
                      const t = uploadedTextures[face];
                      if (t && t.startsWith('data:image')) {
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: t }) });
                          const data = await res.json();
                          if (data.url) uploadedTextures[face] = data.url;
                        } catch (err) { console.error(err); }
                      }
                    }
                    const designData = {
                      name: savedNamePrompt || `${user?.name || 'My'} Design - ${dimensions.l}×${dimensions.w}×${dimensions.h}`,
                      customDesign: { textures: uploadedTextures, colors: boxColors, textureSettings, text: customText, textStyle: boxTextStyle, textColor: boxTextColor, textSettings: boxTextSettings, dimensions, unit, selectedGSM, selectedMaterial },
                      productId: product?.id,
                    };
                    const method = activeDesignId ? 'PATCH' : 'POST';
                    const payload = activeDesignId ? { ...designData, designId: activeDesignId } : designData;
                    const res = await fetch('/api/designs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const result = await res.json();
                    if (res.ok && result.success) {
                      if (!activeDesignId && result.design?._id) setActiveDesignId(result.design._id);
                      setDraftSaved(true);
                      showToast("Design saved successfully!");
                      setTimeout(() => setDraftSaved(false), 3000);
                    } else {
                      const errorMsg = result.error || 'Failed to save design';
                      showToast(errorMsg, "error");
                      if (res.status === 401) router.push('/login');
                    }
                  } catch (e) {
                    console.error('Save Design Error:', e);
                    showToast('An unexpected error occurred while saving.', "error");
                  } finally {
                    setIsSavingDraft(false);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-sm ${draftSaved ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600'
                  }`}
              >
                {isSavingDraft ? <RefreshCw size={12} className="animate-spin" /> : draftSaved ? <Check size={12} /> : <Save size={12} />}
                <span className="hidden sm:inline">{isSavingDraft ? 'Saving' : draftSaved ? 'Saved!' : 'Save'}</span>
              </button>
              {/* Share Design */}
              <button
                disabled={isSharing}
                onClick={async () => {
                  if (isSharing) return;
                  setIsSharing(true);
                  try {
                    const uploadedTextures = { ...boxTextures };
                    for (let face of Object.keys(uploadedTextures)) {
                      const t = uploadedTextures[face];
                      if (t && t.startsWith('data:image')) {
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: t }) });
                          const data = await res.json();
                          if (data.url) uploadedTextures[face] = data.url;
                        } catch (err) { console.error(err); }
                      }
                    }
                    const designData = {
                      name: designName || `${user?.name || 'My'} Design - ${dimensions.l}×${dimensions.w}×${dimensions.h}`,
                      customDesign: { textures: uploadedTextures, colors: boxColors, textureSettings, text: customText, textStyle: boxTextStyle, textColor: boxTextColor, textSettings: boxTextSettings, dimensions, unit, selectedGSM, selectedMaterial },
                      productId: product?.id,
                      isPublic: true,
                    };
                    const method = activeDesignId ? 'PATCH' : 'POST';
                    const payload = activeDesignId ? { ...designData, designId: activeDesignId } : designData;
                    const res = await fetch('/api/designs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                    const result = await res.json();

                    if (res.ok && result.success && (result.design?.shareId)) {
                      if (!activeDesignId && result.design?._id) setActiveDesignId(result.design._id);
                      const link = `${window.location.origin}/design/${result.design.shareId}`;
                      setShareLink(link);
                      try {
                        await navigator.clipboard.writeText(link);
                      } catch (err) {
                        console.warn("Clipboard auto-copy failed, user can copy manually from toast.");
                      }
                      setShareToast(true);
                      setTimeout(() => setShareToast(false), 6000);
                    } else {
                      const errorMsg = result.error || 'Failed to generate share link';
                      showToast(errorMsg, "error");
                      if (res.status === 401) router.push('/login');
                    }
                  } catch (e) {
                    console.error('Share Design Error:', e);
                    showToast('An unexpected error occurred while sharing.', "error");
                  } finally {
                    setIsSharing(false);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-[9px] font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
              >
                {isSharing ? <RefreshCw size={12} className="animate-spin" /> : <Share2 size={12} />}
                <span className="hidden sm:inline">{isSharing ? 'Sharing' : 'Share'}</span>
              </button>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>

          <div
            className="relative h-[42vh] sm:h-[52vh] md:h-[60vh] lg:flex-1 lg:h-auto shrink-0 min-h-[350px] lg:min-h-[500px] bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 rounded-2xl sm:rounded-[3rem] md:rounded-[4rem] lg:rounded-[5rem] border border-gray-200 shadow-xl overflow-hidden cursor-grab active:cursor-grabbing group touch-none"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customMode === "logo") setSelectedFace(selectedFace === "front" ? null : "front");
                    else if (boxTextures.front) setSelectedFace(selectedFace === "front" ? null : "front");
                    else toggleFaceMapping("front");
                  }}
                  onMouseDown={(e) => handleFaceSpatialDown(e, "front")}
                  onMouseMove={(e) => handleFaceSpatialMove(e, "front")}
                  onWheel={(e) => handleFaceSpatialScroll(e, "front")}
                  onDoubleClick={() => setTextureSettings(prev => ({ ...prev, front: { scale: 100, x: 50, y: 50 } }))}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50 group"
                >
                  {!boxTextures.front && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      Front_Panel
                    </div>
                  )}
                  {renderFaceLogo("front")}
                </div>
                <div
                  style={{
                    ...faceStyle("back"),
                    width: L,
                    height: H,
                    transform: `rotateY(180deg) translateZ(${W / 2}px)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customMode === "logo") setSelectedFace(selectedFace === "back" ? null : "back");
                    else if (boxTextures.back) setSelectedFace(selectedFace === "back" ? null : "back");
                    else toggleFaceMapping("back");
                  }}
                  onMouseDown={(e) => handleFaceSpatialDown(e, "back")}
                  onMouseMove={(e) => handleFaceSpatialMove(e, "back")}
                  onWheel={(e) => handleFaceSpatialScroll(e, "back")}
                  onDoubleClick={() => setTextureSettings(prev => ({ ...prev, back: { scale: 100, x: 50, y: 50 } }))}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50 group"
                >
                  {!boxTextures.back && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      Rear
                    </div>
                  )}
                  {renderFaceLogo("back")}
                </div>
                <div
                  style={{
                    ...faceStyle("right"),
                    width: W,
                    height: H,
                    transform: `rotateY(90deg) translateZ(${L / 2}px)`,
                    left: (L - W) / 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customMode === "logo") setSelectedFace(selectedFace === "right" ? null : "right");
                    else if (boxTextures.right) setSelectedFace(selectedFace === "right" ? null : "right");
                    else toggleFaceMapping("right");
                  }}
                  onMouseDown={(e) => handleFaceSpatialDown(e, "right")}
                  onMouseMove={(e) => handleFaceSpatialMove(e, "right")}
                  onWheel={(e) => handleFaceSpatialScroll(e, "right")}
                  onDoubleClick={() => setTextureSettings(prev => ({ ...prev, right: { scale: 100, x: 50, y: 50 } }))}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50 group"
                >
                  {!boxTextures.right && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] rotate-[-90deg]">
                      Right
                    </div>
                  )}
                  {renderFaceLogo("right")}
                </div>
                <div
                  style={{
                    ...faceStyle("left"),
                    width: W,
                    height: H,
                    transform: `rotateY(-90deg) translateZ(${L / 2}px)`,
                    left: (L - W) / 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customMode === "logo") setSelectedFace(selectedFace === "left" ? null : "left");
                    else if (boxTextures.left) setSelectedFace(selectedFace === "left" ? null : "left");
                    else toggleFaceMapping("left");
                  }}
                  onMouseDown={(e) => handleFaceSpatialDown(e, "left")}
                  onMouseMove={(e) => handleFaceSpatialMove(e, "left")}
                  onWheel={(e) => handleFaceSpatialScroll(e, "left")}
                  onDoubleClick={() => setTextureSettings(prev => ({ ...prev, left: { scale: 100, x: 50, y: 50 } }))}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50 group"
                >
                  {!boxTextures.left && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] rotate-[90deg]">
                      Left
                    </div>
                  )}
                  {renderFaceLogo("left")}
                </div>
                <div
                  style={{
                    ...faceStyle("top"),
                    width: L,
                    height: W,
                    transform: `rotateX(90deg) translateZ(${H / 2}px)`,
                    top: (H - W) / 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customMode === "logo") setSelectedFace(selectedFace === "top" ? null : "top");
                    else if (boxTextures.top) setSelectedFace(selectedFace === "top" ? null : "top");
                    else toggleFaceMapping("top");
                  }}
                  onMouseDown={(e) => handleFaceSpatialDown(e, "top")}
                  onMouseMove={(e) => handleFaceSpatialMove(e, "top")}
                  onWheel={(e) => handleFaceSpatialScroll(e, "top")}
                  onDoubleClick={() => setTextureSettings(prev => ({ ...prev, top: { scale: 100, x: 50, y: 50 } }))}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50 group"
                >
                  {!boxTextures.top && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] z-10">
                      Top_Header
                    </div>
                  )}

                  {renderFaceLogo("top")}

                  {customText && textOnBox && (
                    <div
                      className={`absolute drop-shadow-2xl flex items-center justify-center pointer-events-none ${textStyleMap[boxTextStyle]}`}
                      style={{
                        left: `${boxTextSettings.x}%`,
                        top: `${boxTextSettings.y}%`,
                        transform: "translate(-50%, -50%) translateZ(2px)",
                        fontSize: `${boxTextSettings.size}px`,
                        color: boxTextColor,
                        width: '100%',
                        zIndex: 30
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customMode === "logo") setSelectedFace(selectedFace === "bottom" ? null : "bottom");
                    else if (boxTextures.bottom) setSelectedFace(selectedFace === "bottom" ? null : "bottom");
                    else toggleFaceMapping("bottom");
                  }}
                  onMouseDown={(e) => handleFaceSpatialDown(e, "bottom")}
                  onMouseMove={(e) => handleFaceSpatialMove(e, "bottom")}
                  onWheel={(e) => handleFaceSpatialScroll(e, "bottom")}
                  onDoubleClick={() => setTextureSettings(prev => ({ ...prev, bottom: { scale: 100, x: 50, y: 50 } }))}
                  className="absolute border border-gray-200 flex items-center justify-center overflow-hidden bg-white/50 group"
                >
                  {!boxTextures.bottom && (
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">
                      base
                    </div>
                  )}
                  {renderFaceLogo("bottom")}
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
                        {(parseFloat(dimensions[d]) || 0).toFixed(unit === "mm" ? 0 : 1)}
                        <span className="text-[10px] sm:text-xs not-italic ml-0.5 text-gray-500 lowercase">
                          {unit}
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

              {/* Spatial UI Controls - Minimal Floating Status */}
              <AnimatePresence>
                {selectedFace && boxTextures[selectedFace] && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-gray-950 text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/10 pointer-events-auto"
                  >
                    <div className="flex items-center gap-2 border-r border-white/10 pr-6">
                      <Move size={14} className="text-emerald-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{selectedFace} Active</span>
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                      <span>Drag to Pan</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span>Scroll to Zoom</span>
                    </div>
                    <button
                      onClick={() => {
                        setTextureSettings(prev => ({
                          ...prev,
                          [selectedFace]: { scale: 100, x: 50, y: 50 }
                        }));
                        setSelectedFace(null);
                      }}
                      className="ml-4 p-1 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

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

          {/* CUSTOMIZATION OPTIONS UI (BELOW 3D MODEL) */}
          <div className="mt-8 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest">Product Formulation</h3>
              <button
                onClick={() => {
                  setSelectedGSM("300 GSM");
                  setSelectedMaterial("SBS");
                  setQuantity(10);
                  setDimensions({ l: 12, w: 8, h: 4 });
                  setDesignName("Untitled Design");
                  if (typeof setUnit === "function") setUnit("in");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95"
              >
                <RefreshCw size={12} />
                <span>Reset All</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select GSM</label>
                <select
                  value={selectedGSM}
                  onChange={(e) => setSelectedGSM(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-950 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {["230 GSM", "250 GSM", "300 GSM", "350 GSM", "400 GSM"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Material</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-950 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {["SBS", "WhiteBack", "GreyBack", "Art Card", "Maplitho", "Custom Paper"].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* CONTROL PANEL (RIGHT) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="bg-gray-50 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] p-5 sm:p-7 md:p-9 lg:p-10 border border-gray-100 shadow-sm space-y-6 sm:space-y-8 md:space-y-10 relative overflow-hidden">
            {/* Section 1: Geometry */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Ruler size={13} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-950 italic leading-none">
                    Geometry_Core
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[7px] font-black p-1.5 bg-gray-900 text-white rounded-lg tracking-widest uppercase">{unit === 'mm' ? 'Metric' : 'Imperial'}_Active</span>
                  <div className="flex bg-white border border-gray-100 p-1 rounded-xl shadow-inner">
                    <button
                      onClick={() => {
                        if (unit === "mm") {
                          setUnit("in");
                          setDimensions({
                            l: parseFloat((dimensions.l / 25.4).toFixed(1)),
                            w: parseFloat((dimensions.w / 25.4).toFixed(1)),
                            h: parseFloat((dimensions.h / 25.4).toFixed(1))
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${unit === 'in' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400'}`}
                    >IN</button>
                    <button
                      onClick={() => {
                        if (unit === "in") {
                          setUnit("mm");
                          setDimensions({
                            l: Math.round(dimensions.l * 25.4),
                            w: Math.round(dimensions.w * 25.4),
                            h: Math.round(dimensions.h * 25.4)
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${unit === 'mm' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400'}`}
                    >MM</button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {["l", "w", "h"].map((d) => (
                  <div key={d} className="space-y-2 sm:space-y-3">
                    <input
                      type="text"
                      value={dimensions[d] === "" ? "" : dimensions[d]}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
                          setDimensions({
                            ...dimensions,
                            [d]: val === "" ? "" : parseFloat(val) || 0,
                          });
                        }
                      }}
                      onBlur={() => {
                        if (dimensions[d] === "" || dimensions[d] === 0) {
                          setDimensions((prev) => ({ ...prev, [d]: 1 }));
                        }
                      }}
                      className="w-full h-14 sm:h-16 md:h-18 lg:h-20 bg-white border border-gray-200 rounded-2xl sm:rounded-[1.5rem] md:rounded-[1.8rem] px-2 sm:px-4 text-xl sm:text-2xl font-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all shadow-sm text-center text-gray-950"
                    />
                    <p className="text-[10px] sm:text-xs font-black text-gray-600 uppercase tracking-widest text-center">
                      {d === "l" ? "Length" : d === "w" ? "Width" : "Height"}
                    </p>
                  </div>
                ))}
              </div>


              {/* Real-time Metrics Pill */}
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-inner">
                <div className="flex-1">
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">Vol_Cubic_{unit.toUpperCase()}</p>
                  <p className="text-sm font-black text-gray-950">{(dimensions.l * dimensions.w * dimensions.h).toFixed(unit === "mm" ? 0 : 1)}<span className="text-[10px] ml-1 opacity-40 uppercase">{unit}³</span></p>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="flex-1">
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">Surf_Area</p>
                  <p className="text-sm font-black text-gray-950">{(unit === "mm" ? 2 * (dimensions.l * dimensions.w + dimensions.w * dimensions.h + dimensions.h * dimensions.l) : currentSA).toFixed(unit === "mm" ? 0 : 1)}<span className="text-[10px] ml-1 opacity-40 uppercase">{unit}²</span></p>
                </div>
              </div>

            </div>

            {/* Section 2: Asset Library */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8 pt-5 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex p-1 sm:p-1.5 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm w-full sm:w-auto overflow-x-auto no-scrollbar">
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
                    onClick={() => setCustomMode("logo")}
                    className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-90 ${customMode === "logo"
                      ? "bg-gray-950 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-950"
                      }`}
                  >
                    Logo_Lab
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
                  <label className="aspect-square border-2 border-dashed border-gray-300 bg-white rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group overflow-hidden">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Plus
                      size={28}
                      className="text-gray-400 group-hover:text-emerald-600 group-hover:scale-125 transition-all"
                    />
                  </label>
                  {assetPool.map((asset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveAssetIndex(idx)}
                      className={`relative group aspect-square rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all ${activeAssetIndex === idx ? "border-emerald-500 scale-95 shadow-lg" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"}`}
                    >
                      <img src={asset} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageToCrop(asset);
                            setShowCropModal(true);
                          }}
                          title="Crop Image"
                          className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                        >
                          <Scissors size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this texture from your session?")) {
                              setAssetPool(prev => {
                                const newPool = prev.filter((_, i) => i !== idx);
                                if (activeAssetIndex >= newPool.length) {
                                  setActiveAssetIndex(Math.max(0, newPool.length - 1));
                                }
                                return newPool;
                              });
                            }
                          }}
                          title="Delete Texture"
                          className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : customMode === "logo" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <label className="aspect-square border-2 border-dashed border-gray-300 bg-white rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all group overflow-hidden">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBoxLogos(prev => ({ ...prev, [selectedFace || 'top']: reader.result }));
                              showToast("Logo Uploaded!");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Upload size={24} className="text-gray-400 group-hover:text-blue-600 transition-all" />
                    </label>
                    {Object.entries(boxLogos).filter(([_, src]) => src).map(([face, src], idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-[2rem] border-2 border-blue-200 bg-white p-2 group overflow-hidden"
                      >
                        <img src={src} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                          <button
                            onClick={() => saveToVault('logo', src, `Logo_${face}_${new Date().toLocaleDateString()}`)}
                            title="Save to Vault"
                            className="p-1.5 bg-white rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                          >
                            <Sparkles size={12} />
                          </button>
                          <button
                            onClick={() => setBoxLogos(prev => ({ ...prev, [face]: null }))}
                            title="Remove"
                            className="p-1.5 bg-white rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Brand Asset Vault - Logos */}
                  {brandVault.logos?.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                        <Lock size={10} className="text-emerald-500" /> Brand_Vault Assets
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {brandVault.logos.map((vaultLogo, lidx) => (
                          <div
                            key={lidx}
                            onClick={() => setBoxLogos(prev => ({ ...prev, [selectedFace || 'top']: vaultLogo.url }))}
                            className="aspect-square rounded-2xl border border-gray-100 bg-white p-2 cursor-pointer hover:border-emerald-500 hover:scale-105 transition-all group relative overflow-hidden shadow-sm"
                          >
                            <img src={vaultLogo.url} alt={vaultLogo.name} className="w-full h-full object-contain" />
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteFromVault('logo', vaultLogo.url); }}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center translate-x-10 group-hover:translate-x-0 transition-transform duration-300 shadow-md"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                  {/* Logo Control Panel */}
                  {(boxLogos[selectedFace || 'top']) && (
                    <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transform_Logic</span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-widest">{selectedFace || 'Top'} Layer</span>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <span>Logo Scale</span>
                            <span>{logoSettings[selectedFace || 'top'].scale}%</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={logoSettings[selectedFace || 'top'].scale}
                            onChange={(e) => setLogoSettings(prev => ({
                              ...prev,
                              [selectedFace || 'top']: { ...prev[selectedFace || 'top'], scale: parseInt(e.target.value) }
                            }))}
                            className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                              <span>X Offset</span>
                              <span>{logoSettings[selectedFace || 'top'].x}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={logoSettings[selectedFace || 'top'].x}
                              onChange={(e) => setLogoSettings(prev => ({
                                ...prev,
                                [selectedFace || 'top']: { ...prev[selectedFace || 'top'], x: parseInt(e.target.value) }
                              }))}
                              className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                              <span>Y Offset</span>
                              <span>{logoSettings[selectedFace || 'top'].y}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={logoSettings[selectedFace || 'top'].y}
                              onChange={(e) => setLogoSettings(prev => ({
                                ...prev,
                                [selectedFace || 'top']: { ...prev[selectedFace || 'top'], y: parseInt(e.target.value) }
                              }))}
                              className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-gray-50">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <span>Rotation</span>
                            <span>{logoSettings[selectedFace || 'top'].rotate}°</span>
                          </div>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={logoSettings[selectedFace || 'top'].rotate}
                            onChange={(e) => setLogoSettings(prev => ({
                              ...prev,
                              [selectedFace || 'top']: { ...prev[selectedFace || 'top'], rotate: parseInt(e.target.value) }
                            }))}
                            className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
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

                  {/* Brand Asset Vault - Colors */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Lock size={10} className="text-emerald-500" /> My_Branding_Palette
                      </p>
                      <button
                        onClick={() => saveToVault('color', activeColor)}
                        className="p-1 px-3 bg-white border border-gray-200 text-gray-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Star size={10} className="text-emerald-500" fill={brandVault.colors.includes(activeColor) ? "currentColor" : "none"} /> 
                        {brandVault.colors.includes(activeColor) ? "Identified" : "Secure Color"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {brandVault.colors?.length > 0 ? (
                        brandVault.colors.map((c, cidx) => (
                          <div key={cidx} className="relative group">
                            <button
                              onClick={() => setActiveColor(c)}
                              style={{ backgroundColor: c }}
                              className={`w-12 h-12 rounded-2xl border-2 transition-all ${activeColor === c ? "border-emerald-500 scale-90 ring-4 ring-emerald-500/10 shadow-lg" : "border-gray-100 hover:border-emerald-500/40"}`}
                            />
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteFromVault('color', c); }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform shadow-md"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Vault is empty. Secure a color to begin.</p>
                        </div>
                      )}
                    </div>
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
                  {activeChipCategory === 'history' ? (
                    <div className="w-full">
                      {savedPatterns.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
                          {savedPatterns.map((pat, idx) => (
                            <button
                              key={idx}
                              onClick={() => smartApplyAI(pat.url)}
                              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-100 hover:border-emerald-500 transition-all shadow-sm"
                            >
                              <img
                                src={pat.url}
                                alt={pat.prompt}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Plus size={16} className="text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center space-y-2">
                          <ImageIcon size={24} className="mx-auto text-gray-200" />
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">No Patterns Found</p>
                          <p className="text-[8px] text-gray-300">Generate your first design above</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    chipCategories[activeChipCategory].map((chip) => (
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
                    ))
                  )}
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
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-5 border-t border-gray-50 pt-3">
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
                        Font Style
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "bold", label: "Bold", preview: "font-black" },
                          { id: "classic", label: "Classic", preview: "font-serif" },
                          { id: "script", label: "Script", preview: "italic font-serif" },
                          { id: "minimal", label: "Minimal", preview: "font-light tracking-widest" },
                          { id: "modern", label: "Modern", preview: "font-extralight" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setBoxTextStyle(s.id)}
                            className={`py-2 px-1 rounded-xl text-[8px] border transition-all ${boxTextStyle === s.id
                              ? "bg-gray-950 text-white border-gray-950 shadow-md"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                              } ${s.preview}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Position & Size Sliders */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Font Size</p>
                          <span className="text-[9px] font-black text-emerald-600">{boxTextSettings.size}px</span>
                        </div>
                        <input
                          type="range" min="5" max="100" value={boxTextSettings.size}
                          onChange={(e) => setBoxTextSettings(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                          className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Shift X</p>
                          <input
                            type="range" min="0" max="100" value={boxTextSettings.x}
                            onChange={(e) => setBoxTextSettings(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Shift Y</p>
                          <input
                            type="range" min="0" max="100" value={boxTextSettings.y}
                            onChange={(e) => setBoxTextSettings(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                            className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Text Color
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {[
                          "#FFFFFF", "#000000", "#059669", "#F59E0B", "#EF4444",
                          "#6366F1", "#EC4899", "#14B8A6", "#8B5CF6"
                        ].map((c) => (
                          <button
                            key={c}
                            onClick={() => setBoxTextColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${boxTextColor === c ? "border-emerald-500 scale-90 ring-2 ring-emerald-500/10" : "border-gray-200"
                              }`}
                          />
                        ))}
                        <div className="relative">
                          <input
                            type="color"
                            value={boxTextColor}
                            onChange={(e) => setBoxTextColor(e.target.value)}
                            className="w-7 h-7 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10"
                          />
                          <div className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Palette size={12} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={async () => {
                  if ((!aiPrompt && selectedChips.length === 0)) return;

                  setIsGenerating(true);
                  try {
                    const finalPrompt = buildSmartPrompt();

                    // Step 1: Initiate Generation — Send structured context to backend
                    const res = await fetch('/api/customize/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userIdea: aiPrompt.trim(),
                        styles: selectedChips.filter(c => chipCategories.style.includes(c)),
                        industries: selectedChips.filter(c => chipCategories.industry.includes(c)),
                        boxMode,
                        customText: customText.trim(),
                        boxColors: boxColors,
                      })
                    });

                    const startData = await res.json();
                    if (!res.ok) {
                      if (startData.limitReached) {
                        setShowPremiumModal(true);
                      } else {
                        showToast(startData.message || startData.error || "Generation failed", "error");
                      }
                      setIsGenerating(false);
                      return;
                    }

                    const taskId = startData.data.task_id;

                    // Trigger a session refresh immediately to update the generation count UI
                    if (checkUser) checkUser();

                    // Step 2: Poll for Status
                    let completed = false;
                    let attempts = 0;
                    const maxAttempts = 100; // 5 minutes max (100 * 3s)

                    while (!completed && attempts < maxAttempts) {
                      try {
                        await new Promise(r => setTimeout(r, 3000)); // Poll every 3s
                        const statusRes = await fetch(`/api/customize/status/${taskId}`, { cache: 'no-store' });
                        const statusData = await statusRes.json();



                        if (!statusRes.ok) {
                          console.warn("Status check failed, retrying...", statusData);
                          attempts++;
                          continue;
                        }

                        const currentStatus = statusData?.data?.status;

                        if (currentStatus === 'COMPLETED') {
                          console.log("AI Generation Completed Successfully");

                          // Extract image URL from various possible response structures
                          const data = statusData?.data;
                          let imageUrl = null;

                          if (Array.isArray(data?.generated) && data.generated.length > 0) {
                            imageUrl = data.generated[0];
                          } else if (Array.isArray(data?.result) && data.result.length > 0) {
                            imageUrl = data.result[0];
                          } else if (data?.result?.items?.length > 0) {
                            imageUrl = data.result.items[0].url;
                          } else if (typeof data?.result === 'string') {
                            imageUrl = data.result;
                          }

                          if (imageUrl) {
                            console.log("Applying AI texture:", imageUrl);
                            smartApplyAI(imageUrl);

                            // Persistent Save: Store on Website History
                            try {
                              const saveRes = await fetch('/api/user/save-pattern', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  url: imageUrl,
                                  prompt: aiPrompt || "AI Generated Design"
                                })
                              });

                              if (saveRes.ok) {
                                setSavedPatterns(prev => [
                                  { url: imageUrl, prompt: aiPrompt || "AI Generated Design", createdAt: new Date() },
                                  ...prev
                                ].slice(0, 12));
                              }
                            } catch (e) { console.error("Auto-save failed:", e); }

                            if (checkUser) checkUser();
                            completed = true;
                            break; // Exit loop immediately
                          } else {
                            console.error("Failed to extract imageUrl from response. Structure:", data);
                            // If we can't find the image but it's "COMPLETED", this is a structure error
                            throw new Error("Image URL not found in completed response");
                          }
                        } else if (currentStatus === 'FAILED') {
                          throw new Error(statusData?.data?.message || "Generation process failed on server");
                        }
                      } catch (pollErr) {
                        console.error("Polling error:", pollErr);
                        // Don't stop on single poll error, keep trying until timeout
                      }
                      attempts++;
                    }

                    if (!completed) throw new Error("Generation timed out");

                  } catch (err) {
                    console.error("Forge Error:", err);
                    showToast("Forge error: " + err.message, "error");
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={
                  isGenerating ||
                  (!aiPrompt.trim() && selectedChips.length === 0)
                }
                className="w-full py-4 sm:py-5 md:py-6 bg-gray-950 text-white rounded-xl sm:rounded-2xl font-black uppercase text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.45em] flex items-center justify-center gap-3 sm:gap-4 hover:bg-emerald-500 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
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
              <div className="flex justify-center items-center mt-3 gap-2">
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                  {user?.aiUnlimitedUntil && new Date(user.aiUnlimitedUntil) > new Date() ? 'Unlimited Generations Enabled' : `${Math.max(0, 5 - (user?.aiGenerationCount || 0))} Generations Left Today`}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <ShoppingCart size={12} className="text-white" />
                </div>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Order_Quantity</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") { setQuantity(""); return; }
                    let val = parseInt(raw, 10);
                    if (isNaN(val)) val = 10;
                    if (val > 5000) val = 5000;
                    setQuantity(val);
                  }}
                  onBlur={() => {
                    if (!quantity || quantity < 10) setQuantity(10);
                  }}
                  className="w-20 h-8 bg-white border border-emerald-200 rounded-lg text-center font-black text-xs focus:border-emerald-500 outline-none"
                />
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Units</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(10, (parseInt(quantity) || 10) - 50))}
                className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <Minus size={14} />
              </button>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={quantity || 10}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="flex-1 h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <button
                onClick={() => setQuantity(Math.min(5000, (parseInt(quantity) || 10) + 50))}
                className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-emerald-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-b from-emerald-500/5 to-transparent p-4 sm:p-6 md:p-8 border-b border-emerald-100 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <Box size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-black text-gray-950">Custom Designed Box</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mt-0.5">{dimensions.l}{unit} × {dimensions.w}{unit} × {dimensions.h}{unit}</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1.5">{selectedMaterial} • {selectedGSM}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-3 border border-emerald-100">
                <div className="text-center"><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Qty</p><p className="text-xl font-black text-emerald-600 mt-1">{quantity}</p></div>
                <div className="border-l border-r border-gray-100 text-center"><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Price</p><p className="text-xl font-black text-emerald-600 mt-1">₹{calculatedUnitPrice}</p></div>
                <div className="text-center"><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total</p><p className="text-xl font-black text-emerald-600 mt-1">₹{(parseFloat(calculatedUnitPrice) * quantity).toLocaleString('en-IN')}</p></div>
              </div>
            </div>
            <div className="bg-emerald-500 px-4 sm:px-6 md:px-8 py-5 sm:py-6 text-black flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Est. Total Cost</p>
                <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter mt-1">₹{(parseFloat(calculatedUnitPrice) * quantity).toLocaleString('en-IN')}</h2>
              </div>
              <button
                disabled={isAddingToCart}
                onClick={async () => {
                  if (isAddingToCart) return;
                  setIsAddingToCart(true);

                  try {
                    const uploadedBoxTextures = { ...boxTextures };
                    const faces = Object.keys(uploadedBoxTextures);
                    for (let face of faces) {
                      const texture = uploadedBoxTextures[face];
                      if (texture && texture.startsWith("data:image")) {
                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ image: texture })
                          });
                          const data = await res.json();
                          if (data.url) {
                            uploadedBoxTextures[face] = data.url;
                          }
                        } catch (err) {
                          console.error(`Failed to upload texture for ${face}:`, err);
                        }
                      }
                    }

                    const userName = user?.name || user?.username || "Guest";
                    const customName = `${userName}_customize ${dimensions.l}x${dimensions.w}x${dimensions.h}`;
                    const customImg = uploadedBoxTextures.front || uploadedBoxTextures.top || Object.values(uploadedBoxTextures).find(t => t) || product.img || product.images?.[0];

                    const customizedProduct = {
                      ...product,
                      id: `${product.id}-${Date.now()}`,
                      name: customName,
                      img: customImg,
                      price: calculatedUnitPrice,
                      customDesign: {
                        textures: uploadedBoxTextures,
                        colors: boxColors,
                        textureSettings: textureSettings,
                        text: customText,
                        textStyle: boxTextStyle,
                        textColor: boxTextColor,
                        textSettings: boxTextSettings,
                        dimensions: dimensions,
                        unit: unit,
                        selectedGSM: selectedGSM,
                        selectedMaterial: selectedMaterial
                      }
                    };
                    addToCart(customizedProduct, quantity);
                  } finally {
                    setIsAddingToCart(false);
                  }
                }}
                className="w-full sm:w-auto py-4 sm:h-16 md:h-20 px-6 sm:px-8 md:px-12 bg-black text-white rounded-xl sm:rounded-2xl md:rounded-[2rem] font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] flex items-center justify-center gap-3 sm:gap-4 hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 group shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <RefreshCw size={20} className="animate-spin shrink-0" />
                ) : (
                  <ShoppingCart
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                )}
                {isAddingToCart ? "Deploying..." : "Add_to_Basket"}
              </button>
            </div>
          </div>
          {/* Share Toast Notification */}
          <AnimatePresence>
            {shareToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 z-[9999] bg-gray-950 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
              >
                <Link2 size={16} className="text-emerald-400" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Design Share Link</p>
                  <p className="text-[10px] font-bold text-gray-400 truncate max-w-[200px] sm:max-w-xs mb-2">{shareLink}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      showToast("Link copied to clipboard!", "success");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                  >
                    <Copy size={10} /> Copy Link
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Crop Modal Overlay */}
          <AnimatePresence>
            {showCropModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] bg-gray-950/80 backdrop-blur-md flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col"
                >
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-gray-950 uppercase tracking-tighter">Perfect_Crop</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Adjust mapping for structural fit</p>
                    </div>
                    <button onClick={() => setShowCropModal(false)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="relative h-[50vh] bg-gray-950">
                    <Cropper
                      image={imageToCrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={handleCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>

                  <div className="p-8 bg-gray-50 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zoom_Precision</p>
                        <span className="text-sm font-black text-gray-950">{Math.round(zoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <button
                      onClick={finalizeCrop}
                      className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-emerald-500 transition-all shadow-xl active:scale-95"
                    >
                      Apply_Neural_Mapping
                    </button>
                    <button
                      onClick={() => {
                        setShowCropModal(false);
                        setImageToCrop(null);
                      }}
                      className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-950 transition-colors"
                    >
                      Skip & Use Original
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Experience Warning */}
      <AnimatePresence>
        {showMobileWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md p-8 sm:p-10 shadow-2xl border border-white/20 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10" />

              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Monitor className="w-16 h-16 text-emerald-500" />
                  <Smartphone className="w-8 h-8 text-emerald-200 absolute -bottom-1 -right-2 bg-white rounded-lg p-1 border border-emerald-50" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-widest leading-tight mb-4">
                Upgrade Your <br />Design Canvas
              </h3>

              <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed mb-8">
                The 3D Customize Lab is a high-precision spatial tool. For the absolute best creative experience, we recommend using a <span className="text-emerald-600 font-black">Laptop or Tablet</span>.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setShowMobileWarning(false)}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all active:scale-95"
                >
                  Continue to Lab
                </button>
                <button
                  onClick={() => router.push('/shop')}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-gray-950 hover:text-white transition-all"
                >
                  Return to Shop
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md p-8 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 blur-[80px] -z-10 rounded-full" />
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-widest leading-tight">Upgrade to Neural Pro</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  You've reached your free limit of 5 AI generations for today.
                  Unlock unlimited designs for just <span className="text-emerald-500 font-black text-base">₹59 / week</span>.
                </p>
                <div className="w-full space-y-3 mt-6">
                  <button
                    onClick={() => {
                      showToast("Routing to payment gateway to subscribe for ₹59/week.", "info");
                      setShowPremiumModal(false);
                    }}
                    className="w-full py-4 bg-gray-950 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-500 transition-all active:scale-95"
                  >
                    Unlock Unlimited - ₹59
                  </button>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="w-full py-3 bg-gray-50 text-gray-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:text-gray-950 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
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
      `}</style>
    </motion.div>
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
