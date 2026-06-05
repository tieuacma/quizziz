"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface ParticleEffectProps {
  trigger: "correct" | "wrong" | "celebration" | "streak";
  x: number;
  y: number;
  onDone?: () => void;
}

const COLORS = {
  correct: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
  wrong: ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3"],
  celebration: ["#a78bfa", "#38bdf8", "#e879f9", "#fbbf24", "#34d399"],
  streak: ["#f97316", "#fb923c", "#fdba74", "#fed7aa"],
};

const generateParticles = (
  x: number,
  y: number,
  type: "correct" | "wrong" | "celebration" | "streak",
  count: number = 20,
): Particle[] => {
  const particles: Particle[] = [];
  const colors = COLORS[type];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed =
      type === "celebration" ? 3 + Math.random() * 5 : 2 + Math.random() * 3;

    particles.push({
      id: Date.now() + i,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (type === "celebration" ? 2 : 0),
      size:
        type === "celebration" ? 3 + Math.random() * 5 : 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: 0.8 + Math.random() * 0.4,
    });
  }

  return particles;
};

export default function ParticleSystem() {
  const [effects, setEffects] = useState<
    Array<{
      id: number;
      type: ParticleEffectProps["trigger"];
      x: number;
      y: number;
      particles: Particle[];
    }>
  >([]);

  const triggerEffect = useCallback(
    (type: ParticleEffectProps["trigger"], x: number, y: number) => {
      const count = type === "celebration" ? 50 : type === "streak" ? 30 : 20;
      const particles = generateParticles(x, y, type, count);

      setEffects((prev) => [
        ...prev,
        { id: Date.now(), type, x, y, particles },
      ]);
    },
    [],
  );

  const removeEffect = useCallback((id: number) => {
    setEffects((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Expose triggerEffect globally for quiz components
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__triggerParticleEffect__ = triggerEffect;
    return () => {
      delete (window as unknown as Record<string, unknown>).__triggerParticleEffect__;
    };
  }, [triggerEffect]);

  return (
    <div className="particle-container pointer-events-none">
      <AnimatePresence>
        {effects.map((effect) => (
          <ParticleBurst
            key={effect.id}
            particles={effect.particles}
            onDone={() => removeEffect(effect.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ParticleBurst({
  particles,
  onDone,
}: {
  particles: Particle[];
  onDone: () => void;
}) {
  const [items, setItems] = useState(particles);
  const startTimeRef = useRef<number>(0);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    // Only start animation once
    if (animationStartedRef.current) return;
    animationStartedRef.current = true;
    
    startTimeRef.current = Date.now();
    
    let animationFrame: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setItems((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            vx: p.vx * 0.99, // air resistance
            life: p.life - delta / p.maxLife,
          }))
          .filter((p) => p.life > 0);

        if (updated.length === 0) {
          onDone();
        }

        return updated;
      });

      if (Date.now() - startTimeRef.current < 2000) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onDone();
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [onDone]);

  return (
    <>
      {items.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            opacity: particle.life,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </>
  );
}

// Hook to trigger particle effects
export function useParticleEffect() {
  const triggerEffect = (
    type: "correct" | "wrong" | "celebration" | "streak",
    x: number,
    y: number,
  ) => {
    const globalTrigger = (window as unknown as Record<string, unknown>).__triggerParticleEffect__ as
      | ((type: "correct" | "wrong" | "celebration" | "streak", x: number, y: number) => void)
      | undefined;
    if (typeof globalTrigger === "function") {
      globalTrigger(type, x, y);
    }
  };

  return { triggerEffect };
}

// Helper component to trigger particles on click
export function ParticleTrigger({
  children,
  type,
  className,
  onClick,
}: {
  children: React.ReactNode;
  type: "correct" | "wrong" | "celebration" | "streak";
  className?: string;
  onClick?: () => void;
}) {
  const { triggerEffect } = useParticleEffect();

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    triggerEffect(type, x, y);
    onClick?.();
  };

  return (
    <div className={cn("cursor-pointer", className)} onClick={handleClick}>
      {children}
    </div>
  );
}
