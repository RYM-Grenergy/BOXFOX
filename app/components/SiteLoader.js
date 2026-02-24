"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Custom Boxes",
  "Mailer Boxes",
  "Rigid Boxes",
  "Bakery Packaging",
];

const TAGLINES = [
  "Crafting your studio…",
  "Loading premium materials…",
  "Calibrating design forge…",
  "Almost ready…",
];

export default function SiteLoader() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dotsActive, setDotsActive] = useState([false, false, false, false]);
  const router = useRouter();

  useEffect(() => {
    // Check if this is the first time the user is visiting
    let hasSeenLoader = false;
    try {
      hasSeenLoader = localStorage.getItem("hasSeenLoader");
    } catch (e) {
      console.warn("Storage access failed", e);
    }

    if (hasSeenLoader) {
      setVisible(false);
      return;
    }

    // Set flag and show loader
    try {
      localStorage.setItem("hasSeenLoader", "true");
    } catch (e) { }
    setVisible(true);

    // Smooth progress 0→100 over 1.5s
    const totalDuration = 1500;
    const interval = 50;
    const increment = (interval / totalDuration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(100, p + increment);
      });
    }, interval);

    // Step cycling every 400ms (to fit in 1.5s)
    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 400);

    // Stagger box-type dots
    STEPS.forEach((_, i) => {
      setTimeout(
        () => {
          setDotsActive((prev) => {
            const n = [...prev];
            n[i] = true;
            return n;
          });
        },
        100 + i * 300,
      );
    });

    const fadeTimer = setTimeout(() => setFadeOut(true), 1500);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      // Redirect to homepage after loader finishes
      router.push("/");
    }, 2000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes bf-spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bf-spin-rev  { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        @keyframes bf-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bf-glow-pulse{ 0%,100%{opacity:.1;transform:scale(1)} 50%{opacity:.2;transform:scale(1.1)} }
        @keyframes bf-step-in   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bf-shimmer   { from{transform:translateX(-100%)} to{transform:translateX(220%)} }
        @keyframes bf-dot-pop   { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.35);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes bf-wm        { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bf-bar-glow  { 0%,100%{box-shadow:0 0 6px rgba(16,185,129,.35)} 50%{box-shadow:0 0 16px rgba(16,185,129,.7)} }
        @keyframes bf-fade-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          opacity: fadeOut ? 0 : 1,
          transform: fadeOut ? "scale(1.025)" : "scale(1)",
          transition:
            "opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)",
          pointerEvents: fadeOut ? "none" : "all",
          fontFamily: "'Inter',system-ui,sans-serif",
        }}
      >
        {/* ── Scrolling PACKAGING watermark (matches HeroBanner style) ── */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 0,
            width: "100%",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              gap: 80,
              animation: "bf-wm 20s linear infinite",
              whiteSpace: "nowrap",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: 100,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "rgba(16,185,129,0.04)",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                PACKAGING
              </span>
            ))}
          </div>
        </div>

        {/* ── Top left status badge ── */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 28,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "bf-fade-in .6s ease forwards",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#10b981",
              animation: "bf-glow-pulse 1.6s ease infinite",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#9ca3af",
            }}
          >
            Studio Loading
          </span>
        </div>

        {/* ── Top right version badge ── */}
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 28,
            padding: "5px 14px",
            borderRadius: 99,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.3em",
            color: "#059669",
            textTransform: "uppercase",
            animation: "bf-fade-in .6s ease .1s both",
          }}
        >
          Forge v2.5
        </div>

        {/* ── Orbiting rings + floating logo ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 44,
            animation: "bf-fade-in .8s ease .15s both",
          }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(16,185,129,.1) 0%, transparent 68%)",
              animation: "bf-glow-pulse 2.8s ease-in-out infinite",
            }}
          />

          {/* Ring 1 – dashed slow */}
          <div
            style={{
              position: "absolute",
              width: 228,
              height: 228,
              borderRadius: "50%",
              border: "1px dashed rgba(16,185,129,.18)",
              animation: "bf-spin 13s linear infinite",
            }}
          />
          {/* Ring 2 – solid medium reverse */}
          <div
            style={{
              position: "absolute",
              width: 174,
              height: 174,
              borderRadius: "50%",
              border: "1px solid rgba(16,185,129,.3)",
              animation: "bf-spin-rev 7s linear infinite",
            }}
          />
          {/* Ring 3 – solid fast */}
          <div
            style={{
              position: "absolute",
              width: 126,
              height: 126,
              borderRadius: "50%",
              border: "2px solid rgba(16,185,129,.5)",
              animation: "bf-spin 3.2s linear infinite",
            }}
          />

          {/* 5 orbiting dots on ring 2 */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                transform: `rotate(${deg}deg) translateX(87px)`,
                animation: "bf-spin-rev 7s linear infinite",
                opacity: 0.4 + i * 0.12,
              }}
            />
          ))}

          {/* Logo card */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: 104,
              height: 104,
              borderRadius: 24,
              background: "#fff",
              border: "1px solid rgba(16,185,129,.22)",
              boxShadow:
                "0 6px 32px rgba(16,185,129,.14), 0 2px 10px rgba(0,0,0,.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "bf-float 3.6s ease-in-out infinite",
            }}
          >
            <img
              src="/BOXFOX-1.png"
              alt="BoxFox"
              style={{ width: 70, objectFit: "contain" }}
            />
          </div>
        </div>

        {/* ── Brand name ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 6,
            animation: "bf-fade-in .8s ease .3s both",
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: "linear-gradient(to right, transparent, #10b981)",
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "#030712",
            }}
          >
            BoxFox
          </p>
          <div
            style={{
              width: 40,
              height: 1,
              background: "linear-gradient(to left, transparent, #10b981)",
            }}
          />
        </div>
        <p
          style={{
            margin: 0,
            marginBottom: 44,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "#10b981",
            animation: "bf-fade-in .8s ease .4s both",
          }}
        >
          Premium Packaging Studio
        </p>

        {/* ── Progress bar ── */}
        <div
          style={{
            width: 290,
            marginBottom: 8,
            animation: "bf-fade-in .8s ease .5s both",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 3,
              background: "#f3f4f6",
              borderRadius: 99,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #059669, #10b981, #34d399)",
                borderRadius: 99,
                transition: "width .05s linear",
                animation: "bf-bar-glow 1.6s ease infinite",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.55) 50%, transparent 100%)",
                  animation: "bf-shimmer 1.5s ease infinite",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 7,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#9ca3af",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Loading
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#10b981",
                letterSpacing: "0.1em",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* ── Cycling tag line ── */}
        <div
          style={{
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <p
            key={stepIndex}
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#6b7280",
              animation: "bf-step-in .4s ease forwards",
            }}
          >
            {TAGLINES[stepIndex]}
          </p>
        </div>

        {/* ── Box type indicator dots ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            animation: "bf-fade-in .8s ease .6s both",
          }}
        >
          {STEPS.map((label, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 3,
                  background: dotsActive[i] ? "#10b981" : "#e5e7eb",
                  transition: "background .3s ease",
                  animation: dotsActive[i] ? "bf-dot-pop .4s ease" : "none",
                  boxShadow: dotsActive[i]
                    ? "0 0 8px rgba(16,185,129,.5)"
                    : "none",
                }}
              />
              <span
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: dotsActive[i] ? "#10b981" : "#d1d5db",
                  transition: "color .3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Bottom tagline ── */}
        <p
          style={{
            position: "absolute",
            bottom: 22,
            margin: 0,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.28em",
            color: "#d1d5db",
            textTransform: "uppercase",
          }}
        >
          Design · Print · Package · Deliver
        </p>
      </div>
    </>
  );
}
