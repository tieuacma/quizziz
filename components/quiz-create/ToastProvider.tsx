"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
                        toast.type === "success"
                            ? "bg-green-500/10 text-green-100 border-green-500/30"
                            : toast.type === "error"
                              ? "bg-red-500/10 text-red-100 border-red-500/30"
                              : "bg-blue-500/10 text-blue-100 border-blue-500/30"
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="font-medium">{toast.message}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={() => onRemove(toast.id)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
