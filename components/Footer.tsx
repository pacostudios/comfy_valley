"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { chapters, contact } from "@/data/valleys";
import { useLenis, useScrollTo, useSmoothProgress } from "./SmoothScroll";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/valleys", label: "The Valleys" },
  { href: "/#gallery", label: "Gallery" },
];

/** A hand-tuned ridgeline: broad hills, plus a tree-line texture along the crest. */
function ridgePath(base: number, amp: number, phase: number, trees: number) {
  const W = 1600;
  const H = 600;
  let d = `M0 ${H}`;
  for (let x = 0; x <= W; x += 4) {
    const t = x / W;
    const hills =
      Math.sin(t * 5.1 + phase) * amp +
      Math.sin(t * 11.3 + phase * 2.1) * amp * 0.42 +
      Math.sin(t * 23.7 + phase * 0.7) * amp * 0.16;
    const canopy = trees * (Math.abs(Math.sin(t * 190 + phase)) * 0.6 + Math.abs(Math.sin(t * 433 + phase * 3)) * 0.4);
    d += ` L${x} ${(base - hills - canopy).toFixed(1)}`;
  }
  return `${d} L${W} ${H}Z`;
}

const RIDGES = [
  { cls: "far", d: ridgePath(305, 40, 0.2, 3) },
  { cls: "mid", d: ridgePath(405, 40, 2.4, 7) },
  { cls: "near", d: ridgePath(512, 34, 4.3, 13) },
];

export default function Footer() {
  const scene = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const pathname = usePathname();
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  // Settles exactly when the whole scene is on screen.
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start end", "end end"] });
  const p = useSmoothProgress(scrollYProgress);
  const still = (from: string, to: string) => (reduce ? [to, to] : [from, to]);
  const sunY = useTransform(p, [0, 1], still("-30%", "58%"));
  const wordY = useTransform(p, [0, 1], still("75%", "0%"));
  const farY = useTransform(p, [0, 1], still("34%", "0%"));
  const midY = useTransform(p, [0, 1], still("22%", "0%"));
  const nearY = useTransform(p, [0, 1], still("10%", "0%"));
  const ridgeY = { far: farY, mid: midY, near: nearY };

  // Same-page links glide; links to the other page route normally.
  const glide = (e: React.MouseEvent, href: string) => {
    const [path, hash] = href.split("#");
    if ((path || "/") !== pathname) return;
    e.preventDefault();
    if (hash) scrollTo(`#${hash}`);
    else toTop();
  };
  const toTop = () => {
    if (lenis?.current) lenis.current.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div ref={scene} className="footer-scene" aria-hidden>
        <motion.div className="footer-sun" style={{ y: sunY }} />
        <motion.p className="footer-word" style={{ y: wordY }}>
          <span>COMFY</span> <span>VALLEY</span>
        </motion.p>
        {RIDGES.map((r) => (
          <motion.svg
            key={r.cls}
            className={`footer-ridge footer-ridge--${r.cls}`}
            viewBox="0 0 1600 600"
            preserveAspectRatio="none"
            style={{ y: ridgeY[r.cls as keyof typeof ridgeY] }}
          >
            <path d={r.d} />
          </motion.svg>
        ))}
      </div>

      <div className="footer-panel">
        <div className="contours" aria-hidden />
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/images/logo.png" alt="Comfy Valley Private Limited" width={631} height={386} sizes="200px" className="footer-logo" />
            <p>From misty hills to golden shores, Kerala lives and Comfy opens doors.</p>
          </div>

          <nav className="footer-col" aria-label="Explore">
            <h2>Explore</h2>
            {EXPLORE.map((l) => (
              <Link key={l.href} href={l.href} onClick={(e) => glide(e, l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="footer-col" aria-label="The journey">
            <h2>The journey</h2>
            {chapters.map((c) => {
              const href = `/valleys#${c.id}`;
              return (
                <Link key={c.id} href={href} onClick={(e) => glide(e, href)}>
                  {c.name}
                </Link>
              );
            })}
          </nav>

          <div className="footer-col">
            <h2>Get in touch</h2>
            <a href={contact.phoneHref}>{contact.phone}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`https://${contact.website}`}>{contact.website}</a>
            <p>{contact.address}</p>
          </div>
        </div>

        <div className="footer-base">
          <p>© {new Date().getFullYear()} Comfy Valley Private Limited</p>
          <p className="footer-note">
            Demo photography via{" "}
            <a href="https://commons.wikimedia.org" target="_blank" rel="noreferrer">Wikimedia Commons</a>{" "}
            (<a href="/images/CREDITS.md" target="_blank" rel="noreferrer">credits</a>). Not yet Comfy Valley properties.
          </p>
          <button type="button" className="footer-top-btn" onClick={toTop}>
            Back to top <span aria-hidden>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
