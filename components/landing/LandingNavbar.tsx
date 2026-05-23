"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#05040f]/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <span className="text-lg font-black text-white">Z</span>
          </div>
          <span className="font-bold text-white hidden sm:inline">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Chính">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
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
              className="border-white/10 hover:bg-white/8 text-white"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-md shadow-purple-600/25"
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
              className="text-white hover:bg-white/10"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-[#0a0918] border-white/10 w-[min(100vw,20rem)]"
          >
            <SheetHeader>
              <SheetTitle className="text-white">{BRAND.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-6" aria-label="Di động">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-3 text-slate-300 hover:text-white rounded-lg hover:bg-white/5",
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
                  className="w-full border-white/10 text-white"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white">
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
