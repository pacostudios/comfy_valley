"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { chapters, contact, valleys, type Chapter, type Valley } from "@/data/valleys";
import { useScrollTo, useSmoothProgress } from "./SmoothScroll";

// One placeholder repeats until the client supplies property photography.
const DUMMY_IMAGE = "/images/tea.webp";
// Varying the crop and frame stops the repeated placeholder reading as a grid of clones.
const CROPS = ["50% 88%", "18% 78%", "82% 70%", "35% 96%", "68% 90%"];
const FRAMES = ["arch", "leaf", "stone"] as const;

const easeOut = [0.2, 0.8, 0.2, 1] as const;

function Opening() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSmoothProgress(scrollYProgress);
  const bgY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-6%"]);
  const fgY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-22%"]);
  const fgScale = useTransform(p, [0, 1], reduce ? [1.03, 1.03] : [1.03, 1.16]);
  const wordY = useTransform(p, [0, 1], reduce ? ["0vh", "0vh"] : ["0vh", "-26vh"]);
  const copyOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const veil = useTransform(p, [0.5, 1], [0, 1]);

  return (
    <section id="top" ref={ref} className="story-open">
      <div className="story-open-sticky">
        <motion.div className="hero-plane" style={{ y: bgY, scale: 1.03 }}>
          <div className="hero-img is-on">
            <Image src="/images/story-open-bg.webp" alt="" fill priority sizes="170vw" quality={85} />
          </div>
        </motion.div>
        <div className="story-open-scrim" aria-hidden />
        <motion.div className="story-open-word" style={{ y: wordY }}>
          <p className="eyebrow eyebrow--mist">The See Kerala Soul Project</p>
          <h1>
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.2, ease: easeOut }}
            >
              THE VALLEYS
            </motion.span>
          </h1>
        </motion.div>
        <motion.div className="hero-plane" style={{ y: fgY, scale: fgScale }}>
          <div className="hero-img is-on">
            <Image src="/images/story-open-fg.webp" alt="" fill priority sizes="170vw" quality={85} />
          </div>
        </motion.div>
        <motion.div className="story-open-copy" style={{ opacity: copyOpacity }}>
          <p>From misty hills to golden shores, {valleys.length} valleys. One journey called Kerala.</p>
          <span className="story-cue" aria-hidden />
        </motion.div>
        <motion.div className="story-open-veil" style={{ opacity: veil }} aria-hidden />
      </div>
    </section>
  );
}

function Prologue() {
  return (
    <section className="story-prologue">
      <div className="contours" aria-hidden />
      <motion.div
        className="story-prologue-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: easeOut }}
      >
        <p className="story-kicker">A journey of contrasts</p>
        <h2>Kerala is not a destination.</h2>
        <p>
          Comfy Valley invites you to experience it in its complete rhythm: its landscapes, flavours, traditions,
          climates, and living heritage. Walk it chapter by chapter, from the cool of the hills to the warmth of the
          land.
        </p>
      </motion.div>
    </section>
  );
}

function LineWord({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = (i / total) * 0.8;
  const opacity = useTransform(progress, [start, start + 0.2], [0.18, 1]);
  const y = useTransform(progress, [start, start + 0.2], [14, 0]);
  return (
    <motion.span style={{ opacity, y }} className="line-word">
      {word}{" "}
    </motion.span>
  );
}

function ChapterOpener({ chapter, count }: { chapter: Chapter; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSmoothProgress(scrollYProgress);
  const scale = useTransform(p, [0, 1], reduce ? [1, 1] : [1.18, 1]);
  const lineProgress = useTransform(p, [0.05, 0.75], reduce ? [1, 1] : [0, 1]);
  const lift = useTransform(p, [0.7, 1], reduce ? [0, 0] : [0, -60]);
  const words = chapter.line.split(" ");

  return (
    <div ref={ref} className="chapter-open">
      <div className="chapter-open-sticky">
        <motion.div className="chapter-open-img" style={{ scale }}>
          <Image src={chapter.image} alt="" fill sizes="100vw" quality={85} />
        </motion.div>
        {chapter.mist && (
          <>
            <div className="fog-plane fog-plane--back" aria-hidden>
              <div className="fog fog--back" />
            </div>
            <div className="fog-plane fog-plane--front" aria-hidden>
              <div className="fog fog--front" />
            </div>
          </>
        )}
        <div className="chapter-open-shade" aria-hidden />
        <motion.div className="chapter-open-text" style={{ y: lift }}>
          <p className="chapter-mark">
            <span>Chapter {chapter.numeral}</span>
            <span>{chapter.name}</span>
            <span>{count} {count === 1 ? "valley" : "valleys"}</span>
          </p>
          <h2 aria-label={chapter.line}>
            {words.map((w, i) => (
              <LineWord key={i} word={w} i={i} total={words.length} progress={lineProgress} />
            ))}
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

const TRAIL_WIDTH = 120;
const TRAIL_AMP = 34;
const TRAIL_PERIOD = 620;
const trailX = (y: number) => TRAIL_WIDTH / 2 + TRAIL_AMP * Math.sin((y / TRAIL_PERIOD) * Math.PI * 2);

/** A winding dashed footpath down the chapter, with a dot walking it as you scroll. */
function Trail({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  let d = "";
  for (let y = 0; y <= height; y += 14) d += `${y ? "L" : "M"}${trailX(y).toFixed(1)} ${y} `;

  // Paired opposite translates reveal the path top-down using compositor-only transforms.
  const outerY = useTransform(progress, (v) => `${(v - 1) * 100}%`);
  const innerY = useTransform(progress, (v) => `${(1 - v) * 100}%`);
  const dotX = useTransform(progress, (v) => trailX(v * height) - 6);
  const dotY = useTransform(progress, (v) => v * height - 6);

  return (
    <div ref={ref} className="trail" aria-hidden>
      {height > 0 && (
        <>
          <svg className="trail-base" width={TRAIL_WIDTH} height={height}>
            <path d={d} />
          </svg>
          <div className="trail-clip">
            <motion.div className="trail-outer" style={{ y: outerY }}>
              <motion.svg className="trail-done" width={TRAIL_WIDTH} height={height} style={{ y: innerY }}>
                <path d={d} />
              </motion.svg>
            </motion.div>
          </div>
          <motion.span className="trail-dot" style={{ x: dotX, y: dotY }} />
        </>
      )}
    </div>
  );
}

function StoryRow({ valley, index, flip }: { valley: Valley; index: number; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSmoothProgress(scrollYProgress);
  const imgY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);
  const numY = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["34%", "-34%"]);
  const frame = FRAMES[index % FRAMES.length];
  const number = String(index + 1).padStart(2, "0");

  return (
    <article id={valley.slug} ref={ref} className={`story-row${flip ? " story-row--flip" : ""}`}>
      <motion.div
        className={`story-media story-media--${frame}`}
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, ease: easeOut }}
      >
        <motion.div className="story-media-inner" style={{ y: imgY }}>
          <Image
            src={DUMMY_IMAGE}
            alt=""
            fill
            sizes="(max-width: 820px) 90vw, 42vw"
            loading="lazy"
            style={{ objectPosition: CROPS[index % CROPS.length] }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="story-copy"
        initial={reduce ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, delay: 0.1, ease: easeOut }}
      >
        <motion.span className="story-number" style={{ y: numY }} aria-hidden>
          {number}
        </motion.span>
        <p className="story-place">{valley.place}</p>
        <h3>{valley.name}</h3>
        <p className="story-blurb">{valley.blurb}</p>
        <a className="story-enquire" href={`mailto:${contact.email}?subject=${encodeURIComponent(`Enquiry: ${valley.name}`)}`}>
          Enquire about this valley <span aria-hidden>→</span>
        </a>
      </motion.div>
    </article>
  );
}

function ChapterSection({ chapter, list, offset }: { chapter: Chapter; list: Valley[]; offset: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const p = useSmoothProgress(scrollYProgress);

  return (
    <section id={chapter.id} className={`chapter chapter--${chapter.id}`}>
      <ChapterOpener chapter={chapter} count={list.length} />
      <div ref={ref} className="chapter-body">
        <div className="contours" aria-hidden />
        <Trail progress={p} />
        {list.map((v, i) => (
          <StoryRow key={v.slug} valley={v} index={offset + i} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ChapterNav() {
  const [active, setActive] = useState<string | null>(null);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.5;
      let current: string | null = null;
      for (const c of chapters) {
        const r = document.getElementById(c.id)?.getBoundingClientRect();
        if (r && r.top <= line && r.bottom > line) current = c.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav className={`chapter-nav${active ? " is-on" : ""}`} aria-label="Chapters">
      {chapters.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className={active === c.id ? "is-active" : undefined}
          tabIndex={active ? undefined : -1}
          onClick={(e) => {
            e.preventDefault();
            scrollTo(`#${c.id}`);
          }}
        >
          {c.name.replace("The ", "")}
        </a>
      ))}
    </nav>
  );
}

function Ending() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSmoothProgress(scrollYProgress);
  const y = useTransform(p, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <section id="end" ref={ref} className="story-end">
      <motion.div className="story-end-img" style={{ y }}>
        <Image src="/images/forest.webp" alt="" fill sizes="100vw" loading="lazy" />
      </motion.div>
      <div className="story-end-shade" aria-hidden />
      <motion.div
        className="story-end-copy"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: easeOut }}
      >
        <h2>
          Endless emotions.
          <br />
          <em>One journey called Kerala.</em>
        </h2>
        <div className="story-end-actions">
          <a className="btn" href={`mailto:${contact.email}`}>
            Plan your journey <span aria-hidden>→</span>
          </a>
          <Link className="btn" href="/">
            Back to home
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function ValleysStory() {
  let offset = 0;
  return (
    <main>
      <Opening />
      <Prologue />
      {chapters.map((chapter) => {
        const list = valleys.filter((v) => v.chapter === chapter.id);
        const section = <ChapterSection key={chapter.id} chapter={chapter} list={list} offset={offset} />;
        offset += list.length;
        return section;
      })}
      <Ending />
      <ChapterNav />
    </main>
  );
}
