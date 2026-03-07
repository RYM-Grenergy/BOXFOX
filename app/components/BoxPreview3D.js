"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

// Renders a single box face with EXACT texture settings (scale, position, color, text)
function BoxFacePreview({ face, textures, textureSettings, colors, text, textStyle, textColor, textSettings, width, height, showLabel = true }) {
    const settings = textureSettings?.[face] || { scale: 100, x: 50, y: 50 };
    const textureUrl = textures?.[face];
    const bgColor = colors?.[face] || "#059669";

    const textStyleMap = {
        bold: { fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center" },
        script: { fontFamily: "serif", fontStyle: "italic", letterSpacing: "0.05em", textAlign: "center" },
        minimal: { fontWeight: 300, letterSpacing: "0.5em", textTransform: "uppercase", textAlign: "center" },
        classic: { fontFamily: "serif", letterSpacing: "normal", textAlign: "center" },
        modern: { fontWeight: 200, letterSpacing: "0.2em", textAlign: "center" },
    };

    const showText = text && face === "top";
    const tSettings = textSettings || { x: 50, y: 50, size: 20 };

    return (
        <div style={{
            width, height, position: "relative", overflow: "hidden", borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.08)",
            backgroundImage: textureUrl ? `url(${textureUrl})` : "none",
            backgroundColor: textureUrl ? bgColor : bgColor,
            backgroundSize: textureUrl ? `${settings.scale}%` : "cover",
            backgroundPosition: `${settings.x}% ${settings.y}%`,
            backgroundRepeat: "no-repeat",
        }}>
            {showText && (
                <div style={{
                    position: "absolute",
                    left: `${tSettings.x}%`, top: `${tSettings.y}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: Math.max(8, tSettings.size * ((parseFloat(width) || 200) / 200)),
                    color: textColor || "#fff",
                    ...(textStyleMap[textStyle] || textStyleMap.bold),
                    whiteSpace: "nowrap", pointerEvents: "none",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}>{text}</div>
            )}
            {!textureUrl && showLabel && (
                <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                    letterSpacing: "0.3em",
                }}>{face}</div>
            )}
        </div>
    );
}

// Generates a canvas snapshot of exactly what's visible on a box face
function useFaceSnapshot() {
    const generate = useCallback(async (textureUrl, settings, faceW, faceH, bgColor, text, textStyle, textColor, textSettings, face) => {
        const canvas = document.createElement("canvas");
        const EXPORT_W = 1200;
        const EXPORT_H = Math.round(EXPORT_W * (faceH / faceW));
        canvas.width = EXPORT_W;
        canvas.height = EXPORT_H;
        const ctx = canvas.getContext("2d");

        // Fill background color
        ctx.fillStyle = bgColor || "#059669";
        ctx.fillRect(0, 0, EXPORT_W, EXPORT_H);

        if (textureUrl) {
            try {
                const img = await new Promise((resolve, reject) => {
                    const i = new Image();
                    i.crossOrigin = "anonymous";
                    i.onload = () => resolve(i);
                    i.onerror = reject;
                    i.src = textureUrl;
                });

                const s = settings || { scale: 100, x: 50, y: 50 };
                // Replicate CSS background-size: ${scale}% behavior
                const scaleFactor = s.scale / 100;
                const imgDisplayW = EXPORT_W * scaleFactor;
                const imgDisplayH = (img.height / img.width) * imgDisplayW;

                // Replicate CSS background-position: ${x}% ${y}%
                const posX = ((s.x / 100) * (EXPORT_W - imgDisplayW));
                const posY = ((s.y / 100) * (EXPORT_H - imgDisplayH));

                ctx.drawImage(img, posX, posY, imgDisplayW, imgDisplayH);
            } catch (e) {
                console.error("Snapshot image load failed:", e);
            }
        }

        // Render text overlay if on top face
        if (text && face === "top") {
            const ts = textSettings || { x: 50, y: 50, size: 20 };
            const fontSize = Math.round(ts.size * (EXPORT_W / 200));
            const styleMap = {
                bold: { font: `900 ${fontSize}px sans-serif` },
                script: { font: `italic ${fontSize}px serif` },
                minimal: { font: `300 ${fontSize}px sans-serif` },
                classic: { font: `${fontSize}px serif` },
                modern: { font: `200 ${fontSize}px sans-serif` },
            };
            ctx.fillStyle = textColor || "#ffffff";
            ctx.font = (styleMap[textStyle] || styleMap.bold).font;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 4;
            ctx.fillText(text, (ts.x / 100) * EXPORT_W, (ts.y / 100) * EXPORT_H);
        }

        return canvas.toDataURL("image/png");
    }, []);

    return { generate };
}

// Interactive mini 3D box using CSS transforms - same technique as customize page
function MiniBox3D({ customDesign, size = 160 }) {
    const { textures, textureSettings, colors, text, textStyle, textColor, textSettings, dimensions, unit } = customDesign || {};
    const [rot, setRot] = useState({ x: -25, y: 35 });
    const dragging = useRef(false);
    const containerRef = useRef(null);

    const dims = dimensions || { l: 12, w: 8, h: 4 };
    const maxVal = Math.max(dims.l, dims.w, dims.h);
    const factor = size / maxVal;
    const L = dims.l * factor;
    const W = dims.w * factor;
    const H = dims.h * factor;

    const faceStyle = (face) => {
        const s = textureSettings?.[face] || { scale: 100, x: 50, y: 50 };
        return {
            backgroundImage: textures?.[face] ? `url(${textures[face]})` : "none",
            backgroundColor: colors?.[face] || "rgba(16,185,129,0.15)",
            backgroundSize: textures?.[face] ? `${s.scale}%` : "cover",
            backgroundPosition: `${s.x}% ${s.y}%`,
            backgroundRepeat: "no-repeat",
            position: "absolute",
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
        };
    };

    const textOverlay = (face) => {
        if (!text || face !== "top") return null;
        const ts = textSettings || { x: 50, y: 50, size: 20 };
        return (
            <div style={{
                position: "absolute", left: `${ts.x}%`, top: `${ts.y}%`,
                transform: "translate(-50%, -50%) translateZ(2px)",
                fontSize: Math.max(6, ts.size * (L / 250)),
                color: textColor || "#fff", fontWeight: 900, textTransform: "uppercase",
                letterSpacing: "0.1em", whiteSpace: "nowrap", pointerEvents: "none",
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}>{text}</div>
        );
    };

    return (
        <div ref={containerRef}
            style={{ width: size + 60, height: size + 60, perspective: 1800, cursor: "grab", userSelect: "none", touchAction: "none" }}
            onMouseDown={() => { dragging.current = true; }}
            onMouseMove={e => { if (dragging.current) setRot(r => ({ x: r.x - e.movementY * 0.5, y: r.y + e.movementX * 0.5 })); }}
            onMouseUp={() => { dragging.current = false; }}
            onMouseLeave={() => { dragging.current = false; }}
        >
            <div style={{
                width: L, height: H, margin: "auto", marginTop: (size + 60 - H) / 2,
                transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                transformStyle: "preserve-3d", position: "relative",
                transition: dragging.current ? "none" : "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}>
                {/* Front */}
                <div style={{ ...faceStyle("front"), width: L, height: H, transform: `translateZ(${W / 2}px)` }}>
                    {!textures?.front && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 7, fontWeight: 900, color: "rgba(0,0,0,0.15)", textTransform: "uppercase", letterSpacing: "0.3em" }}>F</span>}
                </div>
                {/* Back */}
                <div style={{ ...faceStyle("back"), width: L, height: H, transform: `rotateY(180deg) translateZ(${W / 2}px)` }}>
                    {!textures?.back && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 7, fontWeight: 900, color: "rgba(0,0,0,0.15)", textTransform: "uppercase" }}>B</span>}
                </div>
                {/* Right */}
                <div style={{ ...faceStyle("right"), width: W, height: H, transform: `rotateY(90deg) translateZ(${L / 2}px)`, left: (L - W) / 2 }}>
                    {!textures?.right && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 7, fontWeight: 900, color: "rgba(0,0,0,0.15)" }}>R</span>}
                </div>
                {/* Left */}
                <div style={{ ...faceStyle("left"), width: W, height: H, transform: `rotateY(-90deg) translateZ(${L / 2}px)`, left: (L - W) / 2 }}>
                    {!textures?.left && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 7, fontWeight: 900, color: "rgba(0,0,0,0.15)" }}>L</span>}
                </div>
                {/* Top */}
                <div style={{ ...faceStyle("top"), width: L, height: W, transform: `rotateX(90deg) translateZ(${H / 2}px)`, top: (H - W) / 2 }}>
                    {!textures?.top && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 7, fontWeight: 900, color: "rgba(0,0,0,0.15)" }}>T</span>}
                    {textOverlay("top")}
                </div>
                {/* Bottom */}
                <div style={{ ...faceStyle("bottom"), width: L, height: W, transform: `rotateX(-90deg) translateZ(${H / 2}px)`, top: (H - W) / 2 }}>
                    {!textures?.bottom && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 7, fontWeight: 900, color: "rgba(0,0,0,0.15)" }}>Bo</span>}
                </div>
            </div>
        </div>
    );
}

export { BoxFacePreview, MiniBox3D, useFaceSnapshot };
