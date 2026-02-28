"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClassFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedClassId: string;
    onClassChange: (value: string) => void;
    classes: { id: string; name: string }[];
}

export function ClassFilters({
    searchTerm,
    onSearchChange,
    selectedClassId,
    onClassChange,
    classes
}: ClassFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    placeholder="Tìm kiếm học sinh..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <select
                className="border rounded-lg px-3 py-2 text-sm bg-white"
                value={selectedClassId}
                onChange={(e) => onClassChange(e.target.value)}
            >
                <option value="Tất cả">Tất cả lớp</option>
                {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
            </select>
            <Button variant="outline" size="icon">
                <Filter size={18} />
            </Button>
        </div>
    );
}
