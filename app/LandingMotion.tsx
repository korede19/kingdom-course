"use client";

import { useEffect } from "react";
import styles from "./landing.module.css";

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function countUp(el: HTMLElement, target: number, duration = 1700) {
  const start = performance.now();
  const tick = (now: number) => {
    const t = clamp((now - start) / duration);
    el.textContent = String(Math.round(target * easeOutCubic(t)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * Drives every scroll effect on the landing page. Renders nothing.
 *
 * - toggles `data-scrolled` on the page root (sticky nav styling)
 * - exposes `--scroll` (page progress) and `--hero-p` (hero parallax) as CSS variables
 * - reveals `[data-reveal]` elements as they enter the viewport (`data-in`)
 * - counts `[data-count]` numbers up when they appear
 * - lights up `[data-scrub]` text word by word as it scrolls through
 *
 * With reduced motion enabled, only the sticky nav state runs: no reveals, parallax or smooth scrolling.
 */
export function LandingMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-landing]");
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = reduce ? "auto" : "smooth";

    const observers: IntersectionObserver[] = [];
    const scrubs = Array.from(root.querySelectorAll<HTMLElement>("[data-scrub]")).map((el) => ({
      el,
      words: Array.from(el.querySelectorAll<HTMLElement>("[data-w]")),
    }));
    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));

    if (!reduce) {
      root.classList.add(styles.motion);
      counters.forEach((el) => {
        el.textContent = "0";
      });

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.setAttribute("data-in", "");
            el.querySelectorAll<HTMLElement>("[data-count]").forEach((c) => {
              countUp(c, Number(c.dataset.count) || 0);
            });
            io.unobserve(el);
          }
        },
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
      );
      root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
      observers.push(io);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = html.scrollHeight - vh;

      if (y > 24) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
      root.style.setProperty("--scroll", String(max > 0 ? clamp(y / max) : 0));

      if (reduce) return;
      root.style.setProperty("--hero-p", String(clamp(y / (vh * 0.9))));

      for (const { el, words } of scrubs) {
        const top = el.getBoundingClientRect().top;
        const start = vh * 0.85;
        const end = vh * 0.3;
        const p = clamp((start - top) / (start - end));
        const n = words.length;
        words.forEach((w, i) => {
          const lit = clamp((p * (n + 4) - i) / 3);
          w.style.opacity = String(0.14 + 0.86 * lit);
        });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      observers.forEach((o) => o.disconnect());
      root.classList.remove(styles.motion);
      root.removeAttribute("data-scrolled");
      root.querySelectorAll("[data-in]").forEach((el) => el.removeAttribute("data-in"));
      scrubs.forEach(({ words }) => words.forEach((w) => w.style.removeProperty("opacity")));
      counters.forEach((el) => {
        el.textContent = el.dataset.count ?? "";
      });
      html.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
