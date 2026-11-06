"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useSmoothProgress } from "./SmoothScroll";

const RHYTHMS = ["Landscapes", "Flavours", "Traditions", "Climates", "Living heritage"];
const TILES = [
  { src: "/images/forest.webp", cls: "tile--a", travel: -60 },
  { src: "/images/mist.webp", cls: "tile--b", travel: -220 },
  { src: "/images/tea.webp", cls: "tile--c", travel: -120 },
  { src: "/images/palms.webp", cls: "tile--d", travel: -300 },
];

type TileProps = (typeof TILES)[number] & { progress: MotionValue<number>; still: boolean };

function Tile({ src, cls, travel, progress, still }: TileProps) {
  const y = useTransform(progress, [0, 1], still ? [0, 0] : [0, travel]);
  return (
    <motion.figure className={`tile ${cls}`} style={{ y }}>
      <Image src={src} alt="" fill sizes="(max-width: 820px) 60vw, 40vw" loading="lazy" />
    </motion.figure>
  );
}

export default function Rhythm() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSmoothProgress(scrollYProgress);
  const lineX = useTransform(smooth, [0, 1], reduce ? ["0%", "0%"] : ["2%", "-34%"]);

  return (
    <section id="gallery" ref={ref} className="rhythm">
      <motion.p className="rhythm-line" style={{ x: lineX }} aria-label={RHYTHMS.join(", ")}>
        {[...RHYTHMS, ...RHYTHMS].map((r, i) => (
          <span key={i} aria-hidden>
            {r}
            <i />
          </span>
        ))}
      </motion.p>
      <div className="rhythm-grid">
        <div className="rhythm-copy">
          <p className="eyebrow">Gallery</p>
          <h2>
            Kerala in its <em>complete rhythm.</em>
          </h2>
        </div>
        {TILES.map((t) => (
          <Tile key={t.cls} {...t} progress={smooth} still={!!reduce} />
        ))}
      </div>
    </section>
  );
}
