"use client";

import React, { useEffect, useState } from "react";

declare global {
    interface Window {
        katex?: {
            render: (
                latex: string,
                element: HTMLElement,
                options?: Record<string, unknown>
            ) => void;
            renderToString: (
                latex: string,
                options?: Record<string, unknown>
            ) => string;
        };
    }
}

interface MathRendererProps {
    text: string;
}

export default function MathRenderer({ text }: MathRendererProps) {
    const [katexLoaded, setKatexLoaded] = useState(false);

    useEffect(() => {
        if (window.katex) {
            queueMicrotask(() => setKatexLoaded(true));
            return;
        }

        if (!document.getElementById("katex-css")) {
            const link = document.createElement("link");
            link.id = "katex-css";
            link.rel = "stylesheet";
            link.href =
                "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css";
            document.head.appendChild(link);
        }

        if (!document.getElementById("katex-js")) {
            const script = document.createElement("script");
            script.id = "katex-js";
            script.src =
                "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js";
            script.async = true;
            script.onload = () => setKatexLoaded(true);
            document.head.appendChild(script);
        } else {
            const checkLoaded = setInterval(() => {
                if (window.katex) {
                    setKatexLoaded(true);
                    clearInterval(checkLoaded);
                }
            }, 100);
            return () => clearInterval(checkLoaded);
        }
    }, []);

    if (!text) return null;

    if (!katexLoaded || !window.katex) {
        return <span className="whitespace-pre-wrap">{text}</span>;
    }

    const renderMathString = (latex: string, isBlock: boolean) => {
        try {
            return window.katex!.renderToString(latex, {
                displayMode: isBlock,
                throwOnError: false,
            } as Record<string, unknown>);
        } catch (err) {
            console.error("KaTeX error:", err);
            return latex;
        }
    };

    const parts: React.ReactNode[] = [];
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    const textSegments: { text: string; isBlock: boolean; latex?: string }[] =
        [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            textSegments.push({
                text: text.substring(lastIndex, match.index),
                isBlock: false,
            });
        }
        textSegments.push({ text: match[0], isBlock: true, latex: match[1] });
        lastIndex = blockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        textSegments.push({ text: text.substring(lastIndex), isBlock: false });
    }

    let keyCounter = 0;
    textSegments.forEach((segment) => {
        if (segment.isBlock && segment.latex) {
            const rendered = renderMathString(segment.latex, true);
            parts.push(
                <div
                    key={`block-${keyCounter++}`}
                    className="my-3 overflow-x-auto py-1"
                    dangerouslySetInnerHTML={{ __html: rendered }}
                />
            );
        } else {
            const inlineRegex = /\$([^\$]+?)\$/g;
            const subText = segment.text;
            let subMatch: RegExpExecArray | null;
            let subLastIndex = 0;

            while ((subMatch = inlineRegex.exec(subText)) !== null) {
                if (subMatch.index > subLastIndex) {
                    parts.push(
                        <span
                            key={`text-${keyCounter++}`}
                            className="whitespace-pre-wrap"
                        >
                            {subText.substring(subLastIndex, subMatch.index)}
                        </span>
                    );
                }
                const rendered = renderMathString(subMatch[1], false);
                parts.push(
                    <span
                        key={`inline-${keyCounter++}`}
                        className="mx-1 inline-block"
                        dangerouslySetInnerHTML={{ __html: rendered }}
                    />
                );
                subLastIndex = inlineRegex.lastIndex;
            }

            if (subLastIndex < subText.length) {
                parts.push(
                    <span
                        key={`text-${keyCounter++}`}
                        className="whitespace-pre-wrap"
                    >
                        {subText.substring(subLastIndex)}
                    </span>
                );
            }
        }
    });

    return <div className="leading-relaxed">{parts}</div>;
}
