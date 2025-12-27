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
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-card/50 backdrop-blur-sm border border-border/60 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={prevMonth}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted hover:text-foreground text-muted-foreground transition-all active:scale-95"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="px-4 font-bold text-lg min-w-[160px] text-center tracking-tight text-foreground">
                            {monthNames[month]} {year}
                        </div>
                        <button
                            onClick={nextMonth}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted hover:text-foreground text-muted-foreground transition-all active:scale-95"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 transition-all shadow-sm active:scale-95"
                    >
                        Today
                    </button>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        <span>Preventive</span>
                    </div>
                    <div className="w-px h-3 bg-border"></div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                        <span>Corrective</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-xl shadow-lg overflow-hidden flex flex-col ring-1 ring-white/5">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-border/60 bg-muted/30 divide-x divide-border/30">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                        <div key={day} className={`py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ${i === 0 || i === 6 ? "bg-muted/10" : ""}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Cells */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-background/40 divide-x divide-y divide-border/40">
                    {/* Empty Slots */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-muted/5 min-h-[100px] pattern-dots opacity-50"></div>
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
                                className={`group min-h-[100px] p-2 relative transition-all duration-200 hover:bg-muted/30 cursor-pointer flex flex-col gap-1.5 
                                    ${isToday ? "bg-primary/5 shadow-inner" : ""}`}
                            >
                                <div className="flex items-center justify-between mb-0.5 pointer-events-none">
                                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-md transition-all
                                        ${isToday
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                            : "text-muted-foreground group-hover:text-foreground group-hover:bg-background/80"}`}
                                    >
                                        {day}
                                    </span>
                                    <div className={`transition-all duration-200 opacity-0 group-hover:opacity-100 ${isToday ? 'opacity-100' : ''}`}>
                                        <div className="h-6 w-6 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all cursor-pointer pointer-events-auto">
                                            <Plus size={12} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[100px] no-scrollbar px-0.5 pb-1">
                                    {dayRequests.map(req => (
                                        <div
                                            key={req.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/maintenance-requests/${req.id}`);
                                            }}
                                            className={`text-[10px] pl-2 pr-2 py-1.5 rounded-md border transition-all hover:scale-[1.02] shadow-sm hover:shadow-md truncate flex items-center gap-2 group/item relative overflow-hidden
                                                ${req.type === 'preventive'
                                                    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300/60'
                                                    : 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50 hover:border-orange-300/60'
                                                }`}
                                            title={`${req.subject} (${req.equipment?.name})`}
                                        >
                                            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${req.type === 'preventive' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                            <span className="font-semibold">{req.type === 'preventive' ? 'PM' : 'CM'}</span>
                                            <span className="font-medium truncate opacity-90">{req.equipment?.name || "Equipment"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
