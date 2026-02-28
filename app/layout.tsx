// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}