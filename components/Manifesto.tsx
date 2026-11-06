"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useSmoothProgress } from "./SmoothScroll";

const TEXT =
  "Kerala is not a destination. It is a journey of contrasts. Where hills breathe cool whispers, backwaters sing silent songs, spices scent the air, waves kiss the sands, and every mile tells a new cultural story.";
const EMPHASIS = new Set(["hills", "backwaters", "spices", "waves"]);
const words = TEXT.split(" ");

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const start = (i / words.length) * 0.92;
  const opacity = useTransform(progress, [start, start + 0.08], [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className={EMPHASIS.has(word) ? "em" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSmoothProgress(scrollYProgress);
  const progress = useTransform(smooth, [0.02, 0.9], reduce ? [1, 1] : [0, 1]);

  return (
    <section id="about" ref={ref} className="manifesto">
      <div className="manifesto-sticky">
        <p className="eyebrow">The See Kerala Soul Project</p>
        <p className="manifesto-text">
          {words.map((w, i) => (
            <Word key={i} word={w} i={i} progress={progress} />
          ))}
        </p>
      </div>
    </section>
  );
}
