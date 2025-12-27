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
    Construction,
    Wrench,
    GripVertical
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
    new: { label: "New Requests", color: "text-blue-500", border: "border-blue-200", icon: Plus, bg: "bg-blue-500/5" },
    in_progress: { label: "In Progress", color: "text-amber-500", border: "border-amber-200", icon: Construction, bg: "bg-amber-500/5" },
    repaired: { label: "Repaired", color: "text-emerald-500", border: "border-emerald-200", icon: CheckCircle2, bg: "bg-emerald-500/5" },
    scrap: { label: "Scrap / Unrepairable", color: "text-red-500", border: "border-red-200", icon: Trash2, bg: "bg-red-500/5" },
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
        // make the drag image transparent or stylish if possible, but default is fine for now
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
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-6 md:p-8 max-w-[1600px] mx-auto w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Task Board</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Manage and track maintenance requests.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold px-3 py-1 bg-secondary text-secondary-foreground border border-border rounded-md shadow-sm">
                        Technician View
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-w-[1024px]">
                    {(Object.keys(stages) as Array<keyof typeof stages>).map((stageKey) => {
                        const config = stages[stageKey];
                        const columnRequests = columns[stageKey];

                        return (
                            <div
                                key={stageKey}
                                className={`flex-1 min-w-[300px] flex flex-col rounded-xl bg-muted/40 backdrop-blur-sm border border-border/60 overflow-hidden shadow-sm transition-colors ${isDragging ? 'hover:bg-muted/60' : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stageKey)}
                            >
                                {/* Column Header */}
                                <div className={`p-4 border-b border-border/60 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10`}>
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-1.5 rounded-md bg-background shadow-sm border ${config.border} ${config.color}`}>
                                            <config.icon className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-bold text-sm text-foreground tracking-wide">{config.label}</h3>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground">
                                        {columnRequests.length}
                                    </span>
                                </div>

                                {/* Drop Area / List */}
                                <div className={`flex-1 p-3 overflow-y-auto space-y-3 ${config.bg}`}>
                                    {columnRequests.map((request) => {
                                        const overdue = isOverdue(request.requestDate) && request.stage !== "repaired" && request.stage !== "scrap";

                                        return (
                                            <div
                                                key={request.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, request.id)}
                                                onDragEnd={handleDragEnd}
                                                className={`
                                                    group relative bg-card rounded-lg p-4 border border-border/60 shadow-sm cursor-grab active:cursor-grabbing
                                                    hover:ring-1 hover:ring-primary/20 hover:border-primary/20 hover:shadow-md transition-all duration-200
                                                    ${overdue ? "border-l-[3px] border-l-red-500" : ""}
                                                    ${isDragging && draggedRequestId === request.id ? 'opacity-40 scale-[0.98] grayscale' : 'opacity-100'}
                                                `}
                                            >
                                                {/* Drag Handle (Visual) */}
                                                <div className="absolute top-3 right-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors cursor-grab">
                                                    <GripVertical className="w-4 h-4" />
                                                </div>

                                                {/* High Priority Badge */}
                                                {request.priority > 1 && (
                                                    <div className="mb-3">
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-500/10 border border-red-500/10 px-2 py-0.5 rounded-sm">
                                                            <AlertTriangle className="w-3 h-3" /> High Priority
                                                        </span>
                                                    </div>
                                                )}

                                                <h4 className="font-semibold text-sm text-foreground mb-1.5 pr-6 leading-tight">
                                                    {request.subject}
                                                </h4>

                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                                                    <Wrench className="w-3 h-3 text-primary/60" />
                                                    <span className="font-medium">{request.equipment?.name || "General Maintenance"}</span>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                                    {/* Technician Avatar */}
                                                    {request.technician ? (
                                                        <div className="flex items-center gap-2" title={request.technician.name}>
                                                            {request.technician.avatarUrl ? (
                                                                <img src={request.technician.avatarUrl} alt={request.technician.name} className="w-6 h-6 rounded-md object-cover ring-1 ring-border" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-primary/20">
                                                                    {request.technician.name[0]}
                                                                </div>
                                                            )}
                                                            <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">{request.technician.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border" title="Unassigned">
                                                            <UserIcon className="w-3 h-3" />
                                                        </div>
                                                    )}

                                                    {/* Date */}
                                                    <div className={`text-[10px] font-semibold flex items-center gap-1 ${overdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                                                        <Clock className="w-3 h-3" />
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
        </div>
    );
}
