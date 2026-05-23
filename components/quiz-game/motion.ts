"use client";

import { useEffect, useState } from "react";
import type { Transition, Variants } from "framer-motion";

export const QUESTION_FEEDBACK_MS = 900;
export const READING_SUB_ADVANCE_MS = 600;

const easeOut = [0.22, 1, 0.36, 1] as const;

const questionVariantsFull: Variants = {
  initial: { opacity: 0, x: 48, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -48, filter: "blur(4px)" },
};

const questionVariantsReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const subQuestionVariantsFull: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const subQuestionVariantsReduced: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    // This hook is used in client components.
    // Lazily read matchMedia so we don't need an effect for initial state.
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


export function useQuestionMotion() {
  const reduced = useReducedMotion();
  return {
    variants: reduced ? questionVariantsReduced : questionVariantsFull,
    transition: {
      duration: reduced ? 0.15 : 0.35,
      ease: easeOut,
    } satisfies Transition,
  };
}

export function useSubQuestionMotion() {
  const reduced = useReducedMotion();
  return {
    variants: reduced ? subQuestionVariantsReduced : subQuestionVariantsFull,
    transition: {
      duration: reduced ? 0.15 : 0.3,
      ease: easeOut,
    } satisfies Transition,
  };
}

/** @deprecated Use useQuestionMotion in client components */
export function getQuestionTransition(): Transition {
  return { duration: 0.35, ease: easeOut };
}

/** @deprecated Use useQuestionMotion in client components */
export function getQuestionVariants(): Variants {
  return questionVariantsFull;
}

/** @deprecated Use useSubQuestionMotion in client components */
export function getSubQuestionVariants(): Variants {
  return subQuestionVariantsFull;
}

export const optionStagger = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export const optionItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};
