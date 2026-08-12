"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-into-view entrance wrapper for the funder-facing "/" page ONLY.
 *
 * Built on the same reduced-motion-safe vocabulary as the existing `.rwo-rise`
 * hero animation (see app/globals.css), not a new approach:
 *   - Reduced-motion users, and browsers without JS, render every section fully
 *     visible with no motion. The armed/hidden state is applied by JS only.
 *   - Elements already in view on load are shown immediately with no animation,
 *     so there is never a hide-then-reveal flash above the fold. The hero keeps
 *     its own one-shot `.rwo-rise` load animation.
 *   - Elements below the fold are "armed" (hidden), then revealed once when they
 *     scroll into view.
 *
 * Never used inside the /demo apparatus, whose stimulus stays static.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "idle" = server/first paint, fully visible. "visible" = shown, no animation.
  // "armed" = hidden, waiting to scroll in. "shown" = animating in.
  const [phase, setPhase] = useState<"idle" | "visible" | "armed" | "shown">(
    "idle",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion: no animation, always visible.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("visible");
      return;
    }

    // Already on screen: show as-is, no arm-then-reveal flicker.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setPhase("visible");
      return;
    }

    setPhase("armed");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase("shown");
            obs.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls =
    phase === "armed"
      ? "rwo-reveal rwo-reveal--armed"
      : phase === "shown"
        ? "rwo-reveal rwo-reveal--armed is-visible"
        : "rwo-reveal";

  return (
    <div ref={ref} className={`${cls} ${className}`}>
      {children}
    </div>
  );
}
