"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
}

export function ConfirmModal({
    open,
    onOpenChange,
    title = "Xác nhận",
    description = "Bạn có chắc chắn muốn thực hiện hành động này không?",
    confirmText = "Xác nhận",
    cancelText = "Huỷ",
    variant = "default",
    onConfirm,
}: ConfirmModalProps) {
    const handleConfirm = useCallback(() => {
        onConfirm();
        onOpenChange(false);
    }, [onConfirm, onOpenChange]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onOpenChange(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onOpenChange]);

    // Prevent scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="pr-8">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {title}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                {description}
                            </p>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-6 right-6 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="transition-all hover:bg-slate-100"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant={variant === "destructive" ? "destructive" : "default"}
                            onClick={handleConfirm}
                            className="transition-all hover:scale-105 active:scale-95"
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
