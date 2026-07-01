"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CalendarDays } from "lucide-react";
import ScheduleSlotForm from "@/components/dashboard/schedule/ScheduleSlotForm";
import TimetableGrid from "@/components/dashboard/schedule/TimetableGrid";
import { useTeachingSchedule } from "@/hooks/useTeachingSchedule";

gsap.registerPlugin(useGSAP);

export default function TeacherScheduleWorkspace() {
    const [schedule, setSchedule] = useTeachingSchedule();
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const ctx = gsap.context(
                () => {
                    // Page entrance animation
                    gsap.fromTo(
                        containerRef.current,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                        }
                    );

                    // Header animation
                    gsap.fromTo(
                        headerRef.current,
                        { opacity: 0, x: -15 },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.5,
                            delay: 0.2,
                            ease: "power2.out",
                        }
                    );

                    // Animate the form
                    const formElement =
                        containerRef.current?.querySelector("form");
                    if (formElement) {
                        gsap.fromTo(
                            formElement,
                            { opacity: 0, y: 15 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.5,
                                delay: 0.3,
                                ease: "power2.out",
                            }
                        );
                    }

                    // Stagger animate the timetable grid rows
                    const tableRows =
                        containerRef.current?.querySelectorAll("tbody tr");
                    if (tableRows && tableRows.length > 0) {
                        gsap.fromTo(
                            tableRows,
                            { opacity: 0, x: -10 },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.4,
                                stagger: 0.05,
                                delay: 0.4,
                                ease: "power2.out",
                            }
                        );
                    }

                    // Animate the schedule slots
                    const slots = containerRef.current?.querySelectorAll(
                        '[class*="from-indigo-500/10"]'
                    );
                    if (slots && slots.length > 0) {
                        gsap.fromTo(
                            slots,
                            { opacity: 0, scale: 0.9, y: 10 },
                            {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.4,
                                stagger: 0.03,
                                delay: 0.5,
                                ease: "back.out(1.5)",
                            }
                        );
                    }
                },
                { scope: containerRef }
            );

            return () => ctx.revert();
        },
        { scope: containerRef }
    );

    const onDelete = (id: number) => {
        setSchedule((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div ref={containerRef} className="space-y-6">
            <ScheduleSlotForm schedule={schedule} onAdd={setSchedule} />

            <section>
                <div ref={headerRef} className="flex items-center gap-2 mb-3">
                    <CalendarDays className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-semibold text-white">
                        Bảng thời khoá biểu
                    </h2>
                    <span className="text-xs text-slate-500 ml-auto">
                        Di chuột vào ô tiết để xóa
                    </span>
                </div>
                <TimetableGrid
                    schedule={schedule}
                    editable
                    onDelete={onDelete}
                />
            </section>
        </div>
    );
}
