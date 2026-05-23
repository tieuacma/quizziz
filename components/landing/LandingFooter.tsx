import Link from "next/link";
import { BRAND, FOOTER_LINKS } from "./landing-data";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#05040f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-lg font-black text-white">Z</span>
              </div>
              <span className="font-bold text-white">{BRAND.name}</span>
            </Link>
            <p className="text-sm text-slate-500">{BRAND.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Tài khoản</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-violet-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm border-t border-white/8 pt-8">
          © 2026 Zenith EDU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
