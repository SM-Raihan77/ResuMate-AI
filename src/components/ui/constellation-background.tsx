"use client";

import React, { useId, useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";

export interface ConstellationBackgroundProps {
  /** Optional custom CSS classes for the outer container */
  className?: string;
  /** Foreground content that sits on top with high contrast */
  children?: React.ReactNode;
  /** Background theme variant */
  variant?: "default" | "vibrant" | "subtle" | "cyber" | "minimal";
  /** Density / total number of particles (defaults to ~70) */
  particleCount?: number;
  /** Movement speed of particles (default: 0.7) */
  particleSpeed?: number;
  /** Link distance threshold in px (default: 140) */
  linkDistance?: number;
  /** Enable mouse hover interaction line grabbing (default: true) */
  interactive?: boolean;
  /** Show ambient purple/warm radial glow orbs in background (default: true) */
  showGlows?: boolean;
  /** Show subtle grid pattern (default: true) */
  showGrid?: boolean;
  /** Custom grid overlay classes */
  gridClassName?: string;
  /** Show subtle star twinkling animation (default: true) */
  twinkle?: boolean;
  /** Particle colors array or single hex string */
  particleColor?: string | string[];
  /** Line link color */
  lineColor?: string;
  /** Line link opacity (0 - 1, default: 0.16) */
  lineOpacity?: number;
  /** Optional callback when particles container is loaded */
  onLoaded?: (container?: Container) => void;
}

// Stable engine loader to prevent re-initializations
const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

export function ConstellationBackground({
  className = "",
  children,
  variant = "default",
  particleCount,
  particleSpeed,
  linkDistance = 140,
  interactive = true,
  showGlows = true,
  showGrid = true,
  gridClassName = "bg-grid-overlay bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]",
  twinkle = true,
  particleColor,
  lineColor,
  lineOpacity = 0.16,
  onLoaded,
}: ConstellationBackgroundProps) {
  const particleId = useId();

  // Compute colors & particle options based on variant presets or custom props
  const config = useMemo(() => {
    switch (variant) {
      case "vibrant":
        return {
          count: particleCount ?? 85,
          speed: particleSpeed ?? 0.9,
          particleColors: particleColor ?? ["#c084fc", "#818cf8", "#38bdf8", "#f472b6", "#ffffff"],
          lineColor: lineColor ?? "#a855f7",
          lineOpacity: lineOpacity ?? 0.22,
          glowPurple: "rgba(147, 51, 234, 0.24)",
          glowWarm: "rgba(251, 146, 60, 0.12)",
          glowCyan: "rgba(56, 189, 248, 0.12)",
          linkDistance: linkDistance ?? 145,
        };
      case "subtle":
        return {
          count: particleCount ?? 50,
          speed: particleSpeed ?? 0.5,
          particleColors: particleColor ?? ["#a5b4fc", "#c4b5fd", "#e2e8f0"],
          lineColor: lineColor ?? "#6366f1",
          lineOpacity: lineOpacity ?? 0.1,
          glowPurple: "rgba(99, 102, 241, 0.12)",
          glowWarm: "rgba(244, 63, 94, 0.06)",
          glowCyan: "rgba(56, 189, 248, 0.06)",
          linkDistance: linkDistance ?? 130,
        };
      case "cyber":
        return {
          count: particleCount ?? 75,
          speed: particleSpeed ?? 0.8,
          particleColors: particleColor ?? ["#ffe600", "#38bdf8", "#a855f7", "#ffffff"],
          lineColor: lineColor ?? "#ffe600",
          lineOpacity: lineOpacity ?? 0.18,
          glowPurple: "rgba(168, 85, 247, 0.18)",
          glowWarm: "rgba(255, 230, 0, 0.12)",
          glowCyan: "rgba(56, 189, 248, 0.1)",
          linkDistance: linkDistance ?? 140,
        };
      case "minimal":
        return {
          count: particleCount ?? 40,
          speed: particleSpeed ?? 0.4,
          particleColors: particleColor ?? ["#94a3b8", "#cbd5e1", "#ffffff"],
          lineColor: lineColor ?? "#64748b",
          lineOpacity: lineOpacity ?? 0.08,
          glowPurple: "rgba(99, 102, 241, 0.06)",
          glowWarm: "rgba(217, 119, 6, 0.04)",
          glowCyan: "rgba(56, 189, 248, 0.04)",
          linkDistance: linkDistance ?? 120,
        };
      case "default":
      default:
        return {
          count: particleCount ?? 70,
          speed: particleSpeed ?? 0.7,
          particleColors: particleColor ?? ["#c084fc", "#818cf8", "#38bdf8", "#ffffff"],
          lineColor: lineColor ?? "#818cf8",
          lineOpacity: lineOpacity ?? 0.16,
          glowPurple: "rgba(124, 58, 237, 0.18)",
          glowWarm: "rgba(251, 113, 133, 0.09)",
          glowCyan: "rgba(56, 189, 248, 0.09)",
          linkDistance: linkDistance ?? 140,
        };
    }
  }, [variant, particleCount, particleSpeed, particleColor, lineColor, lineOpacity, linkDistance]);

  // tsparticles JSON options
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
      fpsLimit: 120,
      detectRetina: true,
      background: {
        color: {
          value: "transparent",
        },
      },
      particles: {
        number: {
          value: config.count,
          density: {
            enable: true,
            width: 1200,
            height: 800,
          },
        },
        color: {
          value: config.particleColors,
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.25, max: 0.85 },
          animation: twinkle
            ? {
                enable: true,
                speed: 0.8,
                sync: false,
                destroy: "none",
                mode: "auto",
                startValue: "random",
              }
            : { enable: false },
        },
        size: {
          value: { min: 1.2, max: 2.8 },
          animation: twinkle
            ? {
                enable: true,
                speed: 1.2,
                sync: false,
                destroy: "none",
                mode: "auto",
                startValue: "random",
              }
            : { enable: false },
        },
        links: {
          enable: true,
          distance: config.linkDistance,
          color: config.lineColor,
          opacity: config.lineOpacity,
          width: 1,
          triangles: {
            enable: true,
            opacity: 0.015,
            color: config.lineColor,
          },
        },
        move: {
          enable: true,
          speed: config.speed,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
          attract: {
            enable: false,
            rotate: {
              x: 600,
              y: 1200,
            },
          },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: interactive,
            mode: "grab",
          },
          onClick: {
            enable: interactive,
            mode: "push",
          },
          resize: {
            enable: true,
            delay: 0.5,
          },
        },
        modes: {
          grab: {
            distance: 170,
            links: {
              opacity: 0.45,
              color: "#c084fc",
            },
          },
          push: {
            quantity: 2,
          },
        },
      },
    }),
    [config, interactive, twinkle]
  );

  return (
    <>
      {/* 1. Deep Dark Navy Gradient Base */}
      <div
        className="fixed inset-0 z-[-40] pointer-events-none bg-[#070913] bg-gradient-to-b from-[#070913] via-[#0a0d18] to-[#060810]"
        aria-hidden="true"
      />

      {/* 2. Full-Screen Dot Grid Overlay Pattern */}
      {showGrid && (
        <div
          className={`fixed inset-0 z-[-30] pointer-events-none opacity-80 ${gridClassName}`}
          aria-hidden="true"
        />
      )}

      {/* 3. Ambient Radial Glow Overlays (Purple / Warm Rose / Cyan) */}
      {showGlows && (
        <div
          className="fixed inset-0 z-[-20] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Top-Left / Center Soft Purple/Indigo Glow */}
          <div
            className="absolute -top-[15%] left-[10%] h-[550px] w-[550px] rounded-full opacity-70 blur-[130px] mix-blend-screen transition-all duration-1000 md:h-[700px] md:w-[700px]"
            style={{
              background: `radial-gradient(circle, ${config.glowPurple} 0%, rgba(124, 58, 237, 0) 70%)`,
            }}
          />

          {/* Right-Center Warm Sunset / Rose Glow for Atmospheric Depth */}
          <div
            className="absolute top-[25%] -right-[10%] h-[450px] w-[450px] rounded-full opacity-60 blur-[140px] mix-blend-screen transition-all duration-1000 md:h-[600px] md:w-[600px]"
            style={{
              background: `radial-gradient(circle, ${config.glowWarm} 0%, rgba(244, 63, 94, 0) 70%)`,
            }}
          />

          {/* Bottom-Center Ambient Cyan / Sky Glow */}
          <div
            className="absolute -bottom-[20%] left-[30%] h-[500px] w-[500px] rounded-full opacity-50 blur-[140px] mix-blend-screen transition-all duration-1000 md:h-[650px] md:w-[650px]"
            style={{
              background: `radial-gradient(circle, ${config.glowCyan} 0%, rgba(56, 189, 248, 0) 70%)`,
            }}
          />

          {/* Subtle Center Vignette Mask to Enhance Center Content Readability */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(7,9,19,0.75)_100%)]" />
        </div>
      )}

      {/* 4. Interactive Constellation Particle Canvas */}
      <div
        className="fixed inset-0 pointer-events-none z-[-10]"
        style={{ position: "fixed", width: "100vw", height: "100vh" }}
        aria-hidden="true"
      >
        <ParticlesProvider init={initParticles}>
          <Particles
            id={`constellation-${particleId.replace(/:/g, "")}`}
            className="h-full w-full"
            options={options}
            particlesLoaded={async (container) => {
              if (onLoaded) {
                onLoaded(container);
              }
            }}
          />
        </ParticlesProvider>
      </div>

      {/* 5. Optional Children Wrapper */}
      {children && (
        <div className={`relative z-10 w-full min-h-screen flex-1 flex flex-col bg-transparent ${className}`}>
          {children}
        </div>
      )}
    </>
  );
}

export default ConstellationBackground;
