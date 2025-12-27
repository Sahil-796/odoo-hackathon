"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Wrench, Plus, Calendar as CalendarIcon, Filter } from "lucide-react";

interface CalendarViewProps {
    requests: any[];
}

export default function CalendarView({ requests }: CalendarViewProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
        // Create date string YYYY-MM-DDTHH:mm
        // Note: Months depend on 0-index.
        const date = new Date(year, month, day);
        // Default to 9:00 AM on that day
        date.setHours(9, 0, 0, 0);

        // Adjust for timezone offset to keep local time when converting to ISO?
        // Actually, straightforward ISO string might shift day if we aren't careful with UTC.
        // Let's manually construct to avoid timezone headaches for simple date picking
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = "09";
        const min = "00";

        const isoLikeString = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

        router.push(`/maintenance-requests/new?type=preventive&scheduledDate=${isoLikeString}`);
    };

    // Helper to get requests for a specific day
    const getRequestsForDay = (day: number) => {
        return requests.filter(req => {
            if (!req.scheduledDate) return false;
            const reqDate = new Date(req.scheduledDate);
            return reqDate.getDate() === day &&
                reqDate.getMonth() === month &&
                reqDate.getFullYear() === year;
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-card border border-border/60 rounded-lg p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-4 py-1 font-bold text-lg min-w-[160px] text-center">
                            {monthNames[month]} {year}
                        </div>
                        <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium text-primary hover:underline underline-offset-4">
                        Today
                    </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border/30">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Preventive</span>
                    <div className="w-2 h-2 rounded-full bg-orange-500 ml-2"></div>
                    <span>Corrective</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-border bg-muted/40 divide-x divide-border/30">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Cells */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-background/50 divide-x divide-y divide-border/30">
                    {/* Empty Slots */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-muted/10 min-h-[100px]"></div>
                    ))}

                    {/* Day Slots */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayRequests = getRequestsForDay(day);
                        const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                        return (
                            <div
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`group min-h-[100px] p-2 relative transition-colors hover:bg-muted/30 cursor-pointer flex flex-col gap-1 ${isToday ? "bg-primary/5" : ""}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground group-hover:text-foreground"}`}>
                                        {day}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded-full text-primary">
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] no-scrollbar">
                                    {dayRequests.map(req => (
                                        <div
                                            key={req.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/maintenance-requests/${req.id}`);
                                            }}
                                            className={`text-[10px] px-2 py-1.5 rounded border transition-all hover:scale-[1.02] shadow-sm truncate flex items-center gap-1.5
                                                ${req.type === 'preventive'
                                                    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50'
                                                    : 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50'
                                                }`}
                                            title={`${req.subject} (${req.equipment?.name})`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${req.type === 'preventive' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                            <span className="font-medium truncate">{req.equipment?.name || "Equipment"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Trailing Empty Slots (Optional for full grid look, skipping for now) */}
                </div>
            </div>
        </div>
    );
}
