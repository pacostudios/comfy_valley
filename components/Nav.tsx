"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScrollTo } from "./SmoothScroll";

const links = [
  { hash: "#home", label: "Home" },
  { hash: "#about", label: "About" },
  { hash: "#valleys", label: "Valleys" },
  { hash: "#gallery", label: "Gallery" },
  { hash: "#contact", label: "Contact" },
];

// Scroll distance at which the floating island opens into a full-width bar.
const EXPAND_AT = 60;

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [spied, setSpied] = useState("#home");
  const [expanded, setExpanded] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const sections = onHome
      ? links.map((l) => document.querySelector<HTMLElement>(l.hash)).filter((s): s is HTMLElement => s !== null)
      : [];
    const update = () => {
      setExpanded(window.scrollY > EXPAND_AT);
      if (!onHome) return;
      const line = window.innerHeight * 0.4;
      let current = links[0].hash;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = `#${s.id}`;
      setSpied(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [onHome]);

  // On the landing page links glide to their section; elsewhere they route back to it.
  const hrefFor = (hash: string) => {
    if (onHome) return hash;
    if (hash === "#home") return "/";
    return hash === "#valleys" ? "/valleys" : `/${hash}`;
  };
  const active = onHome ? spied : "#valleys";
  const glide = (e: React.MouseEvent, hash: string) => {
    if (!onHome) return;
    e.preventDefault();
    scrollTo(hash);
  };

  return (
    <nav className={`nav${expanded ? " is-expanded" : ""}`} aria-label="Main">
      <Link className="nav-logo" href={hrefFor("#home")} onClick={(e) => glide(e, "#home")}>
        <Image src="/images/logo.png" alt="Comfy Valley" width={631} height={386} sizes="80px" />
      </Link>
      <div className="nav-links">
        {links.map((l) => (
          <Link
            key={l.hash}
            href={hrefFor(l.hash)}
            className={active === l.hash ? "is-active" : undefined}
            aria-current={active === l.hash ? "true" : undefined}
            onClick={(e) => glide(e, l.hash)}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
