"use client";

import { useEffect, useState } from "react";
import type { Transition, Variants } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const pageVariantsFull: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: easeOut },
  },
};

export const pageVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const staggerContainerFull: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

export const staggerContainerReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0 },
  },
};

export const staggerItemFull: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const listRowVariantsFull: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

export const listRowVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const barGrowVariantsFull: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (height: number) => ({
    scaleY: 1,
    opacity: 1,
    height: `${height}%`,
    transition: { duration: 0.6, ease: easeOut },
  }),
};

export const barGrowVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: (height: number) => ({
    opacity: 1,
    height: `${height}%`,
    transition: { duration: 0.15 },
  }),
};

export const heroVariantsFull: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export const heroVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: easeOut },
};

export const defaultTransition: Transition = {
  duration: 0.35,
  ease: easeOut,
};

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useDashboardMotion() {
  const reduced = useReducedMotion();
  return {
    reduced,
    pageVariants: reduced ? pageVariantsReduced : pageVariantsFull,
    staggerContainer: reduced ? staggerContainerReduced : staggerContainerFull,
    staggerItem: reduced ? staggerItemReduced : staggerItemFull,
    listRowVariants: reduced ? listRowVariantsReduced : listRowVariantsFull,
    barGrowVariants: reduced ? barGrowVariantsReduced : barGrowVariantsFull,
    heroVariants: reduced ? heroVariantsReduced : heroVariantsFull,
    cardHover: reduced ? undefined : cardHover,
  };
}
