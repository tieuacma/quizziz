import Link from "next/link";
import { motion } from "framer-motion";
import { BRAND, FOOTER_LINKS } from "./landing-data";

export default function LandingFooter() {
    return (
        <footer className="relative border-t border-white/10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/5 via-transparent to-transparent blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-cyan-600/5 via-transparent to-transparent blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
                {/* Main footer content */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 lg:mb-16">
                    {/* Brand section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="sm:col-span-2 lg:col-span-1"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg p-1"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/40 group-hover:shadow-violet-600/60 transition-shadow ring-1 ring-white/20">
                                <span className="text-lg font-black text-white font-display">
                                    Z
                                </span>
                            </div>
                            <span className="font-bold text-white font-display text-lg tracking-tight group-hover:text-violet-200 transition-colors">
                                {BRAND.name}
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                            {BRAND.tagline}
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: "f", label: "Facebook" },
                                { icon: "x", label: "Twitter/X" },
                                { icon: "in", label: "LinkedIn" },
                            ].map((social) => (
                                <div
                                    key={social.label}
                                    className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center transition-all"
                                    aria-label={social.label}
                                    role="img"
                                >
                                    <span className="text-sm font-bold text-slate-400">
                                        {social.icon}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
                            Sản phẩm
                        </h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.product.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded px-2 py-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Account links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
                            Tài khoản
                        </h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.account.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded px-2 py-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
                            Liên hệ
                        </h3>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.contact.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded px-2 py-1 inline-block"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Footer bottom */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="border-t border-white/10 pt-8 sm:pt-10"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            © 2026 Zenith EDU. Tất cả các quyền được bảo lưu.
                        </p>
                        <div className="flex gap-6">
                            <a
                                href="/privacy"
                                className="text-sm text-slate-500 hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
                            >
                                Chính sách riêng tư
                            </a>
                            <a
                                href="/terms"
                                className="text-sm text-slate-500 hover:text-violet-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
                            >
                                Điều khoản sử dụng
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
