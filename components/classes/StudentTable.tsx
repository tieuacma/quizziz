"use client";

import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentData, ClassData } from "@/lib/types/quiz";
import { Play, Eye, Edit, Trash2, Clock } from "lucide-react";

interface StudentTableProps {
    students: StudentData[];
    classes: (ClassData & { computedStudentsCount: number })[];
}

export function StudentTable({ students, classes }: StudentTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-100">
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Lớp tham gia</TableHead>
                    <TableHead className="text-center">Quiz đã làm</TableHead>
                    <TableHead className="text-center">Điểm TB</TableHead>
                    <TableHead>Hoạt động cuối</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                                    {student.name.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-900">{student.name}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{student.email}</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1">
                                {student.classIds.map(cId => {
                                    const className = classes.find(c => c.id === cId)?.name || "N/A";
                                    return (
                                        <Badge key={cId} variant="outline" className="text-[10px] whitespace-nowrap">
                                            {className}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                            <div className="flex items-center justify-center gap-1">
                                <Play size={12} className="text-slate-400" />
                                {student.quizzesCompleted}
                            </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <span className={`font-semibold ${student.avgScore >= 80 ? 'text-green-600' : student.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {student.avgScore}
                            </span>
                        </TableCell>
                        <TableCell className="text-slate-500">
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {student.lastActivity}
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${student.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {student.status}
                            </span>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Edit size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
