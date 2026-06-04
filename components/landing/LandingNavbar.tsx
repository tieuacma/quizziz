"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
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

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="zenith-glass-nav fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/40 ring-1 ring-white/20 group-hover:shadow-violet-500/50 transition-shadow">
            <span className="text-lg font-black text-white font-display">Z</span>
          </div>
          <span className="font-bold text-white hidden sm:inline font-display tracking-tight">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Chính">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-white/12 hover:bg-white/[0.08] hover:border-white/20 text-white rounded-xl"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 text-white border-0"
            >
              Bắt đầu
            </Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-xl"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="zenith-glass border-white/10 w-[min(100vw,20rem)]"
          >
            <SheetHeader>
              <SheetTitle className="text-white font-display">{BRAND.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-6" aria-label="Di động">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-3 text-slate-300 hover:text-white rounded-xl hover:bg-white/[0.06]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-8">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-white/12 text-white rounded-xl"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full zenith-btn-glow rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0">
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
