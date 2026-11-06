"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "./SmoothScroll";

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

/**
 * Replaces the native scrollbar with a slim rail and a dot. Click or drag the
 * rail to scroll. Mouse only: touch devices keep their own overlay scrollbar.
 */
export default function ScrollIndicator({ sections }: { sections: string[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [stops, setStops] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  // Section markers sit at each section's true position on the rail.
  useEffect(() => {
    const measure = () => {
      const max = maxScroll();
      if (max <= 0) return;
      setStops(
        sections.map((id) => {
          const el = document.getElementById(id);
          return el ? Math.min(1, (el.getBoundingClientRect().top + window.scrollY) / max) : 0;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [sections]);

  const scrollToPointer = (clientY: number, drag: boolean) => {
    const box = rail.current?.getBoundingClientRect();
    if (!box) return;
    const target = Math.min(1, Math.max(0, (clientY - box.top) / box.height)) * maxScroll();
    if (lenis?.current) lenis.current.scrollTo(target, drag ? { lerp: 0.25 } : { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: drag ? "auto" : "smooth" });
  };

  return (
    <div
      className={`scrollbar${dragging ? " is-dragging" : ""}`}
      aria-hidden
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        scrollToPointer(e.clientY, false);
      }}
      onPointerMove={(e) => {
        if (dragging) scrollToPointer(e.clientY, true);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <div ref={rail} className="scrollbar-rail">
        {stops.map((stop, i) => (
          <span key={sections[i]} className="scrollbar-stop" style={{ top: `${stop * 100}%` }} />
        ))}
        <motion.div className="scrollbar-thumb" style={{ y }}>
          <span className="scrollbar-dot" />
        </motion.div>
      </div>
    </div>
  );
}
