"use client";

import { useState, useMemo } from "react";
import studentsData from "@/data/admin/students.json";
import classesData from "@/data/admin/classes.json";

import { UserPlus, Download, Plus } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ClassData, StudentData } from "@/lib/types/quiz";
import { StatsCards } from "@/components/classes/StatsCards";
import { ClassFilters } from "@/components/classes/ClassFilters";
import { ClassCard } from "@/components/classes/ClassCard";
import { StudentTable } from "@/components/classes/StudentTable";

export default function StudentsPage() {
    const rawStudents = studentsData as StudentData[];
    const rawClasses = classesData as ClassData[];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("Tất cả");

    const classes = useMemo(() => {
        const countMap: Record<string, number> = {};
        rawStudents.forEach(student => {
            student.classIds.forEach(cId => {
                countMap[cId] = (countMap[cId] || 0) + 1;
            });
        });

        return rawClasses.map(cls => ({
            ...cls,
            computedStudentsCount: countMap[cls.id] || 0
        }));
    }, [rawStudents, rawClasses]);

    const filteredStudents = useMemo(() => {
        return rawStudents.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesClass = selectedClassId === "Tất cả" || student.classIds.includes(selectedClassId);
            return matchesSearch && matchesClass;
        });
    }, [searchTerm, selectedClassId, rawStudents]);

    const totalClasses = classes.length;
    const totalStudents = rawStudents.length;
    const activeStudents = rawStudents.filter(s => s.status === "Hoạt động").length;
    const avgClassScore = rawStudents.length > 0
        ? Math.round(rawStudents.reduce((acc, s) => acc + s.avgScore, 0) / rawStudents.length)
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Lớp học</h1>
                    <p className="text-slate-500">Quản lý lớp học và học sinh</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download size={18} className="mr-2" />
                        Xuất danh sách
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <UserPlus size={18} className="mr-2" />
                        Thêm lớp mới
                    </Button>
                </div>
            </div>

            <StatsCards
                totalClasses={totalClasses}
                totalStudents={totalStudents}
                activeStudents={activeStudents}
                avgClassScore={avgClassScore}
            />

            <ClassFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedClassId={selectedClassId}
                onClassChange={setSelectedClassId}
                classes={classes.map(c => ({ id: c.id, name: c.name }))}
            />

            <Tabs defaultValue="classes">
                <TabsList className="border-b mb-4">
                    <TabsTrigger value="classes" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
                        Danh sách lớp
                    </TabsTrigger>
                    <TabsTrigger value="students" className="px-4 py-2">Học sinh</TabsTrigger>
                </TabsList>

                <TabsContent value="classes">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((cls) => (
                            <ClassCard key={cls.id} cls={cls} />
                        ))}
                        <Card className="border-dashed border-2 flex items-center justify-center hover:bg-slate-50 cursor-pointer min-h-[150px]">
                            <div className="text-slate-400 flex flex-col items-center">
                                <Plus size={32} />
                                <span className="text-sm mt-2">Thêm lớp mới</span>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="students">
                    <Card>
                        <StudentTable students={filteredStudents} classes={classes} />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
