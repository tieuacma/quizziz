"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND, NAV_LINKS } from "./landing-data";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-white/[0.05] border-b border-white/10 shadow-lg shadow-violet-900/10"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg group"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/40 ring-1 ring-white/20 group-hover:shadow-violet-500/60 transition-shadow"
          >
            <span className="text-lg font-black text-white font-display">Z</span>
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-white font-display tracking-tight text-base">
              {BRAND.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Nền tảng học tập
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2" aria-label="Chính">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 hover:bg-white/[0.08] hover:border-white/25 text-white rounded-xl font-semibold transition-all"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 text-white border-0 font-semibold shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 transition-all"
              >
                Bắt đầu
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-lg"
              aria-label="Mở menu"
            >
              {open ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="zenith-glass border-white/10 w-[min(100vw,20rem)]"
          >
            <SheetHeader>
              <SheetTitle className="text-white font-display flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-black text-white">Z</span>
                  </div>
                  {BRAND.name}
                </div>
                <ThemeToggle />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-8" aria-label="Di động">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-lg font-medium",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition-all"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-8 pt-8 border-t border-white/10">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-white/15 text-white rounded-xl font-semibold"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 font-semibold">
                  Bắt đầu miễn phí
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
