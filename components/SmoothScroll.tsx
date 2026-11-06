"use client";

import Lenis from "lenis";
import { cancelFrame, frame, useSpring, type FrameData, type MotionValue } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

// Scroll feel, in one place. Lower LERP = longer glide after each wheel tick.
const LERP = 0.055;
const WHEEL_MULTIPLIER = 1.1;
// Weight of parallax layers trailing behind the scroll. restDelta is tiny so
// long pinned sections land exactly on their end position instead of snapping.
const TRAIL = { stiffness: 90, damping: 26, mass: 0.6, restDelta: 0.0001, restSpeed: 0.0001 };

/** Adds soft inertia to a 0-1 scroll progress value. */
export function useSmoothProgress(progress: MotionValue<number>) {
  return useSpring(progress, TRAIL);
}

/** The Lenis instance, or null when smooth scrolling is off (reduced motion). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Scrolls to an in-page anchor through Lenis, falling back to native scrolling. */
export function useScrollTo() {
  const lenis = useContext(LenisContext);
  return (hash: string) => {
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    if (lenis?.current) lenis.current.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: "smooth" });
  };
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: LERP, wheelMultiplier: WHEEL_MULTIPLIER, smoothWheel: true });
    ref.current = lenis;
    // Run on Motion's frame loop so scroll and every parallax layer update in the same frame.
    const tick = ({ timestamp }: FrameData) => lenis.raf(timestamp);
    frame.update(tick, true);
    return () => {
      cancelFrame(tick);
      lenis.destroy();
      ref.current = null;
    };
  }, []);

  // On a route change start at the top, or at the hash once the new page has laid out.
  const pathname = usePathname();
  const firstRun = useRef(true);
  useEffect(() => {
    const hash = window.location.hash;
    if (firstRun.current && !hash) {
      firstRun.current = false;
      return;
    }
    firstRun.current = false;
    const jump = () => {
      const target = hash ? document.querySelector<HTMLElement>(hash) : null;
      const lenis = ref.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target ?? 0, { immediate: true, force: true });
      } else if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    };
    jump();
    // Pinned sections measure themselves after mount, which can move the target.
    const t = hash ? setTimeout(jump, 250) : undefined;
    return () => clearTimeout(t);
  }, [pathname]);

  return <LenisContext.Provider value={ref}>{children}</LenisContext.Provider>;
}
