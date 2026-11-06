"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScrollTo, useSmoothProgress } from "./SmoothScroll";

const slides = [
  {
    id: "mist",
    tagline: "From Misty Hills",
    body: "Kerala is not a destination. It is a journey of contrasts. Comfy Valley invites you to experience it in its complete rhythm: its landscapes, flavours, traditions, climates, and living heritage.",
  },
  {
    id: "palms",
    tagline: "To Golden Shores",
    body: "A curated network of immersive staycations and experience spaces, spread across the entire state. Travel the state. Live every landscape. Experience Kerala the Comfy way.",
  },
];

const ease = [0.2, 0.8, 0.2, 1] as const;
const LINES = ["COMFY", "VALLEY"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const scrollTo = useScrollTo();

  const go = (step: number) => {
    setIndex((i) => (i + step + slides.length) % slides.length);
    setTick((t) => t + 1); // restart the autoplay timer after a manual change
  };

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), 8000);
    return () => clearTimeout(t);
  }, [index, tick, reduce]);

  // Scroll parallax: each depth plane travels a different distance.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSmoothProgress(scrollYProgress);
  const still = !!reduce;
  const bgY = useTransform(p, [0, 1], still ? ["0%", "0%"] : ["0%", "-7%"]);
  const bgScale = useTransform(p, [0, 1], still ? [1.04, 1.04] : [1.04, 1.14]);
  const wordY = useTransform(p, [0, 1], still ? ["0vh", "0vh"] : ["0vh", "-30vh"]);
  const wordScale = useTransform(p, [0, 1], still ? [1, 1] : [1, 1.1]);
  const fgY = useTransform(p, [0, 1], still ? ["0%", "0%"] : ["0%", "-26%"]);
  const fgScale = useTransform(p, [0, 1], still ? [1.04, 1.04] : [1.04, 1.2]);
  const fogY = useTransform(p, [0, 1], still ? ["0%", "0%"] : ["0%", "-22%"]);
  const copyY = useTransform(p, [0, 0.5], still ? ["0vh", "0vh"] : ["0vh", "-12vh"]);
  const copyOpacity = useTransform(p, [0, 0.4], [1, 0]);
  const veil = useTransform(p, [0.55, 1], [0, 1]);

  // Pointer parallax on top of the scroll movement.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const bgPX = useTransform(sx, (v) => v * -10);
  const bgPY = useTransform(sy, (v) => v * -6);
  const wordPX = useTransform(sx, (v) => v * 8);
  const wordPY = useTransform(sy, (v) => v * 4);
  const fgPX = useTransform(sx, (v) => v * 24);
  const fgPY = useTransform(sy, (v) => v * 12);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  const slide = slides[index];

  return (
    <section id="home" ref={ref} className="hero" onPointerMove={onPointerMove}>
      <div className="hero-sticky">
        <div className="hero-frame">
          <motion.div className="hero-plane" style={{ y: bgY, scale: bgScale }}>
            <motion.div className="hero-plane-inner" style={{ x: bgPX, y: bgPY }}>
              {slides.map((s, i) => (
                <div key={s.id} className={`hero-img hero-img--${s.id}${i === index ? " is-on" : ""}`}>
                  <Image src={`/images/${s.id}-bg.webp`} alt="" fill priority={i === 0} sizes="170vw" quality={85} />
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="fog-plane fog-plane--back" style={{ y: fogY }} aria-hidden>
            <div className="fog fog--back" />
          </motion.div>

          {/* Darkens the mist behind the title only: the palms stay in front, untouched. */}
          <div className="hero-scrim" aria-hidden />

          <motion.div className="hero-word" style={{ y: wordY, scale: wordScale }}>
            <motion.div style={{ x: wordPX, y: wordPY }}>
              <h1 aria-label="Comfy Valley">
                {LINES.map((line, l) => (
                  <span key={line} className="hero-line" aria-hidden>
                    {line.split("").map((letter, i) => (
                      <span key={i} className="hero-letter">
                        <motion.span
                          initial={reduce ? false : { y: "108%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 1.3, delay: 0.25 + (l * LINES[0].length + i) * 0.05, ease }}
                        >
                          {letter}
                        </motion.span>
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
            </motion.div>
          </motion.div>

          <motion.div className="hero-plane" style={{ y: fgY, scale: fgScale }}>
            <motion.div className="hero-plane-inner" style={{ x: fgPX, y: fgPY }}>
              {slides.map((s, i) => (
                <div key={s.id} className={`hero-img hero-img--${s.id}${i === index ? " is-on" : ""}`}>
                  <Image src={`/images/${s.id}-fg.webp`} alt="" fill priority={i === 0} sizes="170vw" quality={90} />
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="fog-plane fog-plane--front" style={{ y: fogY }} aria-hidden>
            <div className="fog fog--front" />
          </motion.div>

          {/* Sits above the foreground so palms never hide it, moving with the wordmark. */}
          <motion.div className="hero-tag" style={{ y: wordY }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={slide.tagline}
                className="hero-tagline"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
              >
                {slide.tagline}
              </motion.p>
            </AnimatePresence>
          </motion.div>
          <div className="hero-shade" aria-hidden />

          <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {slide.body}
              </motion.p>
            </AnimatePresence>
            <a
              className="btn"
              href="#valleys"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#valleys");
              }}
            >
              Explore the valleys <span aria-hidden>→</span>
            </a>
          </motion.div>

          <motion.div className="hero-arrows" style={{ opacity: copyOpacity }}>
            <button type="button" aria-label="Previous slide" onClick={() => go(-1)}>‹</button>
            <button type="button" aria-label="Next slide" onClick={() => go(1)}>›</button>
          </motion.div>

          <motion.div className="hero-veil" style={{ opacity: veil }} aria-hidden />
        </div>
      </div>
    </section>
  );
}
