"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { featuredValleys, valleys, type Valley } from "@/data/valleys";
import { useSmoothProgress } from "./SmoothScroll";

// One placeholder repeats until the client supplies property photography.
const DUMMY_IMAGE = "/images/tea.webp";

function Card({ valley, i, progress }: { valley: Valley; i: number; progress: MotionValue<number> }) {
  const centre = i / featuredValleys.length;
  const x = useTransform(progress, [centre - 0.3, centre + 0.3], ["9%", "-9%"]);
  return (
    <article className={`card${i % 2 ? " card--low" : ""}`}>
      <span className="card-stop" aria-hidden />
      <Link href={`/valleys#${valley.slug}`} className="card-link">
        <div className="card-media">
          <motion.div className="card-media-inner" style={{ x }}>
            <Image src={DUMMY_IMAGE} alt="" fill sizes="(max-width: 820px) 80vw, 30vw" loading="lazy" />
          </motion.div>
          <span className="card-index">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <p className="card-place">{valley.place}</p>
        <h3>{valley.name}</h3>
        <p className="card-blurb">{valley.blurb}</p>
      </Link>
    </article>
  );
}

export default function Valleys() {
  const pin = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Pinned horizontal travel on desktop; a native swipe rail on small screens.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 821px)");
    const measure = () => setDistance(wide.matches ? Math.max(0, el.scrollWidth - window.innerWidth) : 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: pin, offset: ["start start", "end end"] });
  const reduce = useReducedMotion();
  const smooth = useSmoothProgress(scrollYProgress);
  const progress = reduce ? scrollYProgress : smooth;
  const x = useTransform(progress, (v) => -v * distance);
  const routeWidth = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section
      id="valleys"
      ref={pin}
      className="valleys"
      style={distance ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="valleys-sticky">
        <header className="valleys-head">
          <p className="eyebrow eyebrow--ink">North to south</p>
          <h2>
            {valleys.length} valleys. <em>One journey called Kerala.</em>
          </h2>
        </header>
        <motion.div ref={track} className="valleys-track" style={{ x }}>
          <div className="route" aria-hidden>
            <motion.div className="route-done" style={{ width: routeWidth }} />
          </div>
          {featuredValleys.map((v, i) => (
            <Card key={v.slug} valley={v} i={i} progress={progress} />
          ))}
          <article className="card card--more">
            <span className="card-stop" aria-hidden />
            <Link href="/valleys" className="card-more-link">
              <Image src="/images/forest.webp" alt="" fill sizes="(max-width: 820px) 80vw, 30vw" loading="lazy" />
              <span className="card-more-count">+{valleys.length - featuredValleys.length} more</span>
              <span className="card-more-title">See all {valleys.length} valleys</span>
              <span className="card-more-go" aria-hidden>→</span>
            </Link>
          </article>
        </motion.div>
      </div>
    </section>
  );
}
