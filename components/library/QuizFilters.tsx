"use client";

import { Search, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuizFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedSubject: string;
    onSubjectChange: (value: string) => void;
    selectedGrade: string;
    onGradeChange: (value: string) => void;
    subjects: string[];
    grades: string[];
    viewMode: "grid" | "list";
    onViewModeChange: (mode: "grid" | "list") => void;
}

export function QuizFilters({
    searchTerm,
    onSearchChange,
    selectedSubject,
    onSubjectChange,
    selectedGrade,
    onGradeChange,
    subjects,
    grades,
    viewMode,
    onViewModeChange
}: QuizFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-3 w-full md:w-auto">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Tìm kiếm quiz..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-lg px-3 py-2 text-sm bg-white"
                    value={selectedSubject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                >
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
                <select
                    className="border rounded-lg px-3 py-2 text-sm bg-white"
                    value={selectedGrade}
                    onChange={(e) => onGradeChange(e.target.value)}
                >
                    {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2 border rounded-lg p-1">
                <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewModeChange("list")}
                >
                    <List size={18} />
                </Button>
                <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onViewModeChange("grid")}
                >
                    <Grid3X3 size={18} />
                </Button>
            </div>
        </div>
    );
}
