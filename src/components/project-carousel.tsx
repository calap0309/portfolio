"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { parseTags } from "@/lib/utils";

/** Cards shown per viewport width. Mobile shows 1 card + a 10px peek. */
type Breakpoint = { max: number; perView: number };

const BREAKPOINTS: Breakpoint[] = [
  { max: 639, perView: 1.1 },
  { max: 1023, perView: 1.5 },
  { max: Infinity, perView: 2.5 },
];

const GAP = 24;
const TAP_MIN = 44; // minimum hit area in px (Apple HIG / WCAG)

interface ProjectCarouselProps {
  projects: Project[];
}

/**
 * Horizontal drag carousel (Section III).
 *
 * A single framer-motion `x` MotionValue owns the track position. Native
 * `scrollLeft` mirrors it so the standard scrollbar stays visible and keyboard
 * + pagination maths share one source of truth. Drag uses `drag="x"`,
 * `dragConstraints`, `dragElastic={0.1}`, `dragMomentum`; on release the
 * nearest card eases to the viewport centre. Cards-per-view, tap targets,
 * arrow-key control, edge fades and dots are all handled here.
 *
 * Styled to Apple: hairline tiles with layered shadow, image scales to 1.02 on
 * hover, and pagination dots are small gray circles with a blue active pill.
 */
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  /** Cards-per-view at a given viewport width. */
  const resolvePerView = useCallback((width: number): number => {
    for (const bp of BREAKPOINTS) {
      if (width <= bp.max) return bp.perView;
    }
    return BREAKPOINTS[BREAKPOINTS.length - 1].perView;
  }, []);

  /** Measure container + compute card width. Card = view / perView minus gaps. */
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    setContainerWidth(width);
    const perView = resolvePerView(width);
    setCardWidth(Math.max(0, (width - GAP * (perView - 1)) / perView));
  }, [resolvePerView]);

  // Measure on mount + debounced rAF on resize.
  useEffect(() => {
    measure();
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [measure]);

  const maxScroll = useMemo(
    () => Math.max(0, projects.length * (cardWidth + GAP) - GAP - containerWidth),
    [projects.length, cardWidth, containerWidth]
  );

  const offsetForIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), projects.length - 1);
      return clamped * (cardWidth + GAP);
    },
    [cardWidth, projects.length]
  );

  /** Animate the track (and native scroll) to a slide's centre offset. */
  const goTo = useCallback(
    (index: number) => {
      const target = offsetForIndex(index);
      setActiveIndex(index);
      animate(x, -target, { type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] });
      const el = containerRef.current;
      if (el) el.scrollTo({ left: target, behavior: "smooth" });
    },
    [offsetForIndex, x]
  );

  const goRelative = useCallback(
    (delta: number) => goTo(activeIndex + delta),
    [activeIndex, goTo]
  );

  const handleDragEnd = useCallback(() => {
    const idx = Math.round(-x.get() / (cardWidth + GAP));
    goTo(idx);
  }, [x, cardWidth, goTo]);

  // Keep the native scrollbar in sync while dragging (touch + mouse).
  const syncScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const raw = Math.min(Math.max(-x.get(), 0), el.scrollWidth - el.clientWidth);
    if (Math.abs(el.scrollLeft - raw) > 1) el.scrollLeft = raw;
  }, [x]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goRelative(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goRelative(-1);
      }
    },
    [goRelative]
  );

  // Update dots while dragging so the nearest slide is highlighted live.
  useEffect(() => {
    return x.on("change", () => {
      const idx = Math.round(-x.get() / (cardWidth + GAP || 1));
      if (idx >= 0 && idx < projects.length) setActiveIndex(idx);
    });
  }, [x, cardWidth, projects.length]);

  return (
    <div className="relative w-full">
      {/* Scroll region: keeps the native scrollbar (do NOT hide overflow),
          allows vertical panning, and is focussable for arrow-key control.
          Edge fades are positioned over this region; dots live below it. */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project carousel"
        onKeyDown={handleKeyDown}
        className="carousel-pan relative -mx-1 overflow-x-auto px-1 pb-2 outline-none focus-visible:outline-2 focus-visible:outline-accent"
      >
        <motion.div
          className="flex"
          style={{ x, willChange: "transform" }}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.1}
          dragMomentum
          onDrag={syncScroll}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, i) => (
            <Slide
              key={project.id}
              project={project}
              width={cardWidth}
              x={x}
              cardWidth={cardWidth}
              gap={GAP}
              index={i}
            />
          ))}
        </motion.div>
      </div>

      {/* Edge fades — subtle, tap-through, blends with the page background
          (theme-aware). Hidden below sm to not fight swipes. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-appbg to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-appbg to-transparent sm:block" />

      {/* Pagination dots — full 44px tap area, gap-2. Inactive dots are small
          gray circles; the active dot is a blue pill (Apple-style). */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex ? "true" : undefined}
            onClick={() => goTo(i)}
            className="flex items-center justify-center"
            style={{ minHeight: TAP_MIN, minWidth: TAP_MIN }}
          >
            <span
              className={
                i === activeIndex
                  ? "h-2 w-8 rounded-full bg-accent transition-colors duration-200"
                  : "h-2 w-2 rounded-full bg-subtext/50 transition-colors duration-200 hover:bg-subtext"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function Slide({
  project,
  width,
  x,
  cardWidth,
  gap,
  index,
}: {
  project: Project;
  width: number;
  x: ReturnType<typeof useMotionValue<number>>;
  cardWidth: number;
  gap: number;
  index: number;
}) {
  const tags = parseTags(project.tags);

  // Use `useTransform` on the drag motion value to de-emphasise slides as they
  // move away from the viewport centre. Drag-responsive, not reveal-on-scroll.
  const slideX = -index * (cardWidth + gap);
  const opacity = useTransform(x, (v) => {
    const dist = Math.abs(v - slideX);
    const fade = Math.max(0, 1 - dist / (cardWidth * 2));
    return 0.55 + fade * 0.45;
  });

  return (
    <div className="shrink-0 pr-6" style={{ width: width || "76vw" }}>
      <motion.article
        style={{ opacity }}
        className="will-change-transform flex flex-col overflow-hidden rounded-2xl hairline bg-surface shadow-card transition-shadow duration-300 ease-apple hover:shadow-card-hover"
      >
        <div className="group relative aspect-[16/10] overflow-hidden bg-surface-soft">
          {project.coverImage && (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 639px) 80vw, (max-width: 1023px) 45vw, 32vw"
              className="object-cover transition-transform duration-300 ease-apple group-hover:scale-[1.02]"
            />
          )}
        </div>
        <div className="flex flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold tracking-tight2">{project.title}</h3>
            <span className="shrink-0 text-xs font-normal uppercase tracking-wide text-subtext">
              {project.slug}
            </span>
          </div>
          <p className="text-subtext">{project.description}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full hairline bg-surface-soft px-3 py-1 text-xs font-medium text-subtext"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6 pt-2">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.75rem] items-center gap-1 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                Visit <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.75rem] items-center gap-1 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                <Github className="h-4 w-4" /> Source
              </Link>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
