"use client";

import { useState } from "react";
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    MoreVertical,
    Plus,
    User as UserIcon,
    Trash2,
    Construction
} from "lucide-react";

type Request = {
    id: number;
    subject: string;
    stage: "new" | "in_progress" | "repaired" | "scrap";
    priority: number;
    technician: {
        name: string;
        avatarUrl?: string; // Schema has avatarUrl, but currently user might not
    } | null;
    equipment: {
        name: string;
    } | null;
    requestDate: string; // ISO string from DB
};

const stages = {
    new: { label: "New", color: "border-blue-500", icon: Plus, bg: "bg-blue-50/50" },
    in_progress: { label: "In Progress", color: "border-amber-500", icon: Construction, bg: "bg-amber-50/50" },
    repaired: { label: "Repaired", color: "border-emerald-500", icon: CheckCircle2, bg: "bg-emerald-50/50" },
    scrap: { label: "Scrap", color: "border-red-500", icon: Trash2, bg: "bg-red-50/50" },
};

export default function TechnicianDashboard({ requests: initialRequests }: { requests: Request[] }) {
    const [requests, setRequests] = useState(initialRequests);
    const [draggedRequestId, setDraggedRequestId] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Group requests by stage
    const columns = {
        new: requests.filter(r => r.stage === "new"),
        in_progress: requests.filter(r => r.stage === "in_progress"),
        repaired: requests.filter(r => r.stage === "repaired"),
        scrap: requests.filter(r => r.stage === "scrap"),
    };

    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDraggedRequestId(id);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setDraggedRequestId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Essential to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetStage: string) => {
        e.preventDefault();

        if (!draggedRequestId) return;

        const request = requests.find(r => r.id === draggedRequestId);
        if (!request || request.stage === targetStage) return;

        // Optimistic Update
        const updatedRequests = requests.map(r =>
            r.id === draggedRequestId ? { ...r, stage: targetStage as any } : r
        );
        setRequests(updatedRequests);

        try {
            const res = await fetch("/api/maintenance-requests", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: draggedRequestId, stage: targetStage }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            // Revert optimism if failed
            setRequests(requests);
            // Optionally show toast/error
        }
    };

    const isOverdue = (dateString: string) => {
        const reqDate = new Date(dateString);
        const now = new Date();
        // Simple logic: if request is older than 2 days and not repaired/scrap
        const diffTime = Math.abs(now.getTime() - reqDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 2;
    };

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] overflow-x-auto p-6">
            <div className="flex gap-6 h-full min-w-[1024px] pb-4">
                {(Object.keys(stages) as Array<keyof typeof stages>).map((stageKey) => {
                    const config = stages[stageKey];
                    const columnRequests = columns[stageKey];

                    return (
                        <div
                            key={stageKey}
                            className={`flex-1 min-w-[300px] flex flex-col rounded-xl bg-muted/30 border border-border overflow-hidden`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stageKey)}
                        >
                            {/* Column Header */}
                            <div className={`p-4 border-b border-border flex items-center justify-between ${config.bg}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-md bg-background border ${config.color}`}>
                                        <config.icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-semibold text-foreground">{config.label}</h3>
                                </div>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background border border-border">
                                    {columnRequests.length}
                                </span>
                            </div>

                            {/* Drop Area / List */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-3">
                                {columnRequests.map((request) => {
                                    const overdue = isOverdue(request.requestDate) && request.stage !== "repaired" && request.stage !== "scrap";

                                    return (
                                        <div
                                            key={request.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, request.id)}
                                            onDragEnd={handleDragEnd}
                                            className={`
                        bg-card rounded-lg p-4 border border-border shadow-sm cursor-grab active:cursor-grabbing
                        hover:ring-2 hover:ring-primary/20 hover:shadow-md transition-all
                        ${overdue ? "border-l-4 border-l-red-500" : ""}
                        ${isDragging && draggedRequestId === request.id ? 'opacity-50 scale-95' : 'opacity-100'}
                      `}
                                        >
                                            {/* Priority Tag */}
                                            <div className="flex justify-between items-start mb-2">
                                                {request.priority > 1 ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">
                                                        <AlertTriangle className="w-3 h-3" /> High Priority
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
                                                        Normal
                                                    </span>
                                                )}
                                                <button className="text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <h4 className="font-medium text-foreground mb-1 line-clamp-2">
                                                {request.subject}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                                <Wrench className="w-3 h-3" />
                                                {request.equipment?.name || "General Maintenance"}
                                            </p>

                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-border">
                                                {/* Technician Avatar */}
                                                {request.technician ? (
                                                    <div className="flex items-center gap-2" title={request.technician.name}>
                                                        {request.technician.avatarUrl ? (
                                                            <img src={request.technician.avatarUrl} alt={request.technician.name} className="w-6 h-6 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                {request.technician.name[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground" title="Unassigned">
                                                        <UserIcon className="w-3 h-3" />
                                                    </div>
                                                )}

                                                {/* Date */}
                                                <div className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(request.requestDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Icon helper since lucide icons are components
function Wrench(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    )
}
