"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TeachingScheduleItem,
    WEEK_DAYS,
    WeekDay,
    sortTeachingSchedule,
} from "@/lib/teaching-schedule";

const emptyForm = {
    day: "T2" as WeekDay,
    time: "07:30",
    className: "",
    lessonTitle: "",
    room: "",
};

type ScheduleSlotFormProps = {
    schedule: TeachingScheduleItem[];
    onAdd: (items: TeachingScheduleItem[]) => void;
};

export default function ScheduleSlotForm({
    schedule,
    onAdd,
}: ScheduleSlotFormProps) {
    const [form, setForm] = useState(emptyForm);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.className.trim() || !form.lessonTitle.trim()) return;

        const nextId =
            schedule.length === 0
                ? 1
                : Math.max(...schedule.map((item) => item.id)) + 1;

        const newItem: TeachingScheduleItem = {
            id: nextId,
            day: form.day,
            time: form.time,
            className: form.className.trim(),
            lessonTitle: form.lessonTitle.trim(),
            room: form.room.trim() || "Chưa cập nhật",
        };

        onAdd(sortTeachingSchedule([...schedule, newItem]));
        setForm(emptyForm);
    };

    return (
        <Card className="bg-white/[0.03] border-white/8">
            <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                    <CalendarPlus className="w-4 h-4 text-violet-300" />
                    Thêm tiết học
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="schedule-day">Thứ</Label>
                        <Select
                            value={form.day}
                            onValueChange={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    day: value as WeekDay,
                                }))
                            }
                        >
                            <SelectTrigger
                                id="schedule-day"
                                className="border-white/10 bg-white/[0.02]"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WEEK_DAYS.map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="schedule-time">Giờ học</Label>
                        <Input
                            id="schedule-time"
                            type="time"
                            value={form.time}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    time: e.target.value,
                                }))
                            }
                            className="border-white/10 bg-white/[0.02]"
                            required
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="schedule-class">Lớp</Label>
                        <Input
                            id="schedule-class"
                            placeholder="VD: Lập Trình Web - K22A"
                            value={form.className}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    className: e.target.value,
                                }))
                            }
                            className="border-white/10 bg-white/[0.02]"
                            required
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                        <Label htmlFor="schedule-lesson">
                            Nội dung bài học
                        </Label>
                        <Input
                            id="schedule-lesson"
                            placeholder="VD: Routing trong Next.js"
                            value={form.lessonTitle}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lessonTitle: e.target.value,
                                }))
                            }
                            className="border-white/10 bg-white/[0.02]"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="schedule-room">Phòng</Label>
                        <Input
                            id="schedule-room"
                            placeholder="P.302"
                            value={form.room}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    room: e.target.value,
                                }))
                            }
                            className="border-white/10 bg-white/[0.02]"
                        />
                    </div>

                    <div className="flex items-end sm:col-span-2 lg:col-span-1">
                        <Button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white"
                            disabled={
                                !form.className.trim() ||
                                !form.lessonTitle.trim()
                            }
                        >
                            Thêm tiết
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
