import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Zenith EDU — Hệ thống quản lý học tập",
  description: "Nền tảng quản lý học tập thông minh cho giáo viên và học sinh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html
        lang="vi"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased scroll-smooth`}
      >
        <body className="min-h-full flex flex-col font-sans">
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var t = localStorage.getItem('zenith-theme');
                    if (t === 'light' || t === 'dark' || t === 'galaxy') {
                      document.documentElement.classList.add('theme-' + t);
                    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.classList.add('theme-light');
                    } else {
                      document.documentElement.classList.add('theme-dark');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}
