import * as React from "react";

export default function SectionHeader({
    icon: Icon,
    title,
    right,
}: {
    icon: React.ElementType;
    title: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-white tracking-tight">
                    {title}
                </h2>
            </div>
            {right}
        </div>
    );
}
