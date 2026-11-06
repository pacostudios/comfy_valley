"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { contact } from "@/data/valleys";
import Footer from "./Footer";
import { useSmoothProgress } from "./SmoothScroll";

export default function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSmoothProgress(scrollYProgress);
  const open = useTransform(p, [0, 0.75], reduce ? [0, 0] : [1, 0]);
  const insetY = useTransform(open, (v) => `${v * 22}%`);
  const insetX = useTransform(open, (v) => `${v * 30}%`);
  const clipPath = useMotionTemplate`inset(${insetY} ${insetX})`;
  const imgScale = useTransform(p, [0, 1], reduce ? [1, 1] : [1.3, 1]);
  const textOpacity = useTransform(p, [0.45, 0.8], reduce ? [1, 1] : [0, 1]);
  const textY = useTransform(p, [0.45, 0.8], reduce ? [0, 0] : [40, 0]);

  return (
    <section id="contact">
      <div ref={ref} className="closing">
        <div className="closing-sticky">
          <motion.div className="closing-media" style={{ clipPath }}>
            <motion.div className="closing-img" style={{ scale: imgScale }}>
              <Image src="/images/forest.webp" alt="" fill sizes="100vw" loading="lazy" />
            </motion.div>
            <div className="closing-shade" />
          </motion.div>
          <motion.div className="closing-text" style={{ opacity: textOpacity, y: textY }}>
            <h2>
              Travel the state.
              <br />
              Live every landscape.
              <br />
              <em>Experience Kerala the Comfy way.</em>
            </h2>
            <a className="btn" href={`mailto:${contact.email}`}>
              Plan your journey <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
