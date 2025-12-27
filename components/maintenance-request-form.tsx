"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Calendar as CalendarIcon, Save, Star, History, Wrench } from "lucide-react";
import Link from "next/link";
import WorksheetDrawer from "./worksheet-drawer";

type Option = { id: number; name: string; category?: string; maintenanceTeamId?: number; employeeId?: number; defaultTechnicianId?: number };

export default function MaintenanceRequestForm({
    initialData,
    equipments,
    teams,
    users,
    workCenters,
    currentUser,
    isEdit = false
}: {
    initialData?: any;
    equipments: any[];
    teams: any[];
    users: any[];
    workCenters: any[];
    currentUser: any;
    isEdit?: boolean;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);

    // ... (keep existing state: formData) ...
    // State
    const [formData, setFormData] = useState({
        subject: initialData?.subject || "New Maintenance Request",
        maintenanceScope: initialData?.maintenanceScope || "equipment",
        equipmentId: initialData?.equipmentId || "",
        workCenterId: initialData?.workCenterId || "",
        category: initialData?.category || "",
        requestDate: initialData?.requestDate ? new Date(initialData.requestDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: initialData?.type || "corrective",
        teamId: initialData?.teamId || "",
        technicianId: initialData?.technicianId || "",
        scheduledDate: initialData?.scheduledDate ? new Date(initialData.scheduledDate).toISOString().slice(0, 16) : "",
        duration: initialData?.duration || 0,
        priority: initialData?.priority || 0,
        description: initialData?.description || "",
        stage: initialData?.stage || "new",
    });

    // ... (keep existing effects and handlers) ...
    // Auto-fill Logic
    useEffect(() => {
        if (!isEdit && formData.equipmentId) {
            const eq = equipments.find(e => e.id === parseInt(formData.equipmentId));
            if (eq) {
                setFormData(prev => ({
                    ...prev,
                    category: eq.category || prev.category,
                    teamId: eq.maintenanceTeamId || prev.teamId,
                    technicianId: eq.defaultTechnicianId || prev.technicianId,
                    // subject: prev.subject === "New Maintenance Request" ? `Maintenance for ${eq.name}` : prev.subject
                }));
            }
        }
    }, [formData.equipmentId, equipments, isEdit]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePriority = (level: number) => {
        setFormData(prev => ({ ...prev, priority: level }));
    };

    const handleStage = async (stage: string) => {
        // Optimistic update
        setFormData(prev => ({ ...prev, stage }));

        // If isEdit, save immediately
        if (isEdit && initialData?.id) {
            try {
                await fetch(`/api/maintenance-requests/${initialData.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ stage }),
                });
                router.refresh();
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            ...formData,
            equipmentId: formData.equipmentId ? parseInt(formData.equipmentId) : null,
            workCenterId: formData.workCenterId ? parseInt(formData.workCenterId) : null,
            teamId: formData.teamId ? parseInt(formData.teamId) : null,
            technicianId: formData.technicianId ? parseInt(formData.technicianId) : null,
        };

        try {
            const url = isEdit ? `/api/maintenance-requests/${initialData.id}` : "/api/maintenance-requests";
            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save");

            const data = await res.json();

            if (!isEdit) {
                router.push(`/maintenance-requests/${Array.isArray(data) ? data[0].id : data.id}`);
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save request");
        } finally {
            setIsLoading(false);
        }
    };

    const stages = ["new", "in_progress", "repaired", "scrap"];

    return (
        <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-3">
                    <button type="submit" form="maintenance-form" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-sm flex items-center gap-2">
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {isEdit ? "Save" : "Create"}
                    </button>
                    {isEdit && (
                        <div className="hidden md:block text-muted-foreground text-sm pl-4 border-l border-border">
                            {initialData?.subject}
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div className="flex items-center bg-muted/50 rounded-md p-1">
                    {stages.map((stage) => (
                        <button
                            key={stage}
                            type="button"
                            onClick={() => handleStage(stage)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm uppercase tracking-wider transition-colors ${formData.stage === stage
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                        >
                            {stage.replace("_", " ")}
                        </button>
                    ))}
                </div>

                {/* Smart Button Placeholder - Worksheet */}
                <div className="flex gap-2">
                    {isEdit ? (
                        <button
                            type="button"
                            onClick={() => setIsWorksheetOpen(true)}
                            className="group relative flex flex-col items-center justify-center bg-background border border-border rounded-lg px-4 py-1 hover:bg-muted/50 transition-all shadow-sm active:scale-95"
                        >
                            <div className="flex items-center gap-2 text-primary font-bold">
                                <Wrench size={16} />
                                <span className="text-sm">Worksheet</span>
                            </div>
                            {/* Badge count if needed */}
                            {initialData?.worksheetLines && initialData.worksheetLines.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {initialData.worksheetLines.filter((l: any) => !l.isDone).length || initialData.worksheetLines.length}
                                </span>
                            )}
                        </button>
                    ) : (
                        <div className="group relative">
                            <button
                                type="button"
                                disabled
                                className="flex flex-col items-center justify-center bg-muted/30 border border-border/50 rounded-lg px-4 py-1 cursor-not-allowed opacity-70"
                            >
                                <div className="flex items-center gap-2 text-muted-foreground font-bold">
                                    <Wrench size={16} />
                                    <span className="text-sm">Worksheet</span>
                                </div>
                            </button>
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                                Save request to enable
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden p-8">
                <form id="maintenance-form" onSubmit={handleSubmit} className="space-y-8">
                    {/* ... (existing fields) ... */}
                    {/* Header Inputs */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-muted-foreground mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full text-2xl font-bold bg-transparent border-b border-border focus:border-primary px-0 py-2 outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
                                placeholder="e.g. Broken Conveyor Belt"
                            />
                        </div>
                        <div className="flex flex-col items-end min-w-[200px]">
                            {/* Priority */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Created By</label>
                                <div className="text-sm text-foreground py-1">{isEdit ? (initialData.createdBy?.name || "Unknown") : currentUser.name}</div>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Maintenance For</label>
                                <select
                                    name="maintenanceScope"
                                    value={formData.maintenanceScope}
                                    onChange={handleChange}
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                >
                                    <option value="equipment">Equipment</option>
                                    <option value="work_center">Work Center</option>
                                </select>
                            </div>

                            {formData.maintenanceScope === "equipment" && (
                                <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                                    <label className="text-sm font-semibold text-muted-foreground pt-1.5">Equipment</label>
                                    <div className="flex flex-col gap-1 w-full">
                                        <select
                                            name="equipmentId"
                                            value={formData.equipmentId}
                                            onChange={handleChange}
                                            className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                        >
                                            <option value="">Select Equipment</option>
                                            {equipments.map(e => (
                                                <option key={e.id} value={e.id}>{e.name} ({e.serialNumber})</option>
                                            ))}
                                        </select>
                                        {equipments.find(e => e.id === parseInt(formData.equipmentId || "0"))?.isScrapped && (
                                            <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded border border-red-200 dark:border-red-800 w-fit">
                                                ⚠ This equipment is SCRAPPED
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formData.maintenanceScope === "work_center" && (
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <label className="text-sm font-semibold text-muted-foreground">Work Center</label>
                                    <select
                                        name="workCenterId"
                                        value={formData.workCenterId}
                                        onChange={handleChange}
                                        className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                    >
                                        <option value="">Select Work Center</option>
                                        {workCenters.map(wc => (
                                            <option key={wc.id} value={wc.id}>{wc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Request Date</label>
                                <input
                                    type="date"
                                    name="requestDate"
                                    value={formData.requestDate}
                                    onChange={handleChange}
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4 pt-2">
                                <label className="text-sm font-semibold text-muted-foreground">Maintenance Type</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="type" value="corrective" checked={formData.type === "corrective"} onChange={handleChange} className="accent-primary" />
                                        Corrective
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="type" value="preventive" checked={formData.type === "preventive"} onChange={handleChange} className="accent-primary" />
                                        Preventive
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Team</label>
                                <select
                                    name="teamId"
                                    value={formData.teamId}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Technician</label>
                                <select
                                    name="technicianId"
                                    value={formData.technicianId}
                                    onChange={handleChange}
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                >
                                    <option value="">Select Technician</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Scheduled Date</label>
                                <input
                                    type="datetime-local"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleChange}
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Duration (hrs)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    step="0.5"
                                    className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Priority</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <button
                                            type="button"
                                            key={level}
                                            onClick={() => handlePriority(level)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={20}
                                                className={level <= formData.priority ? "fill-primary text-primary" : "text-muted-foreground/30"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <label className="text-sm font-semibold text-muted-foreground">Company</label>
                                <div className="text-sm text-foreground py-1">{currentUser.company?.name || "My Company"}</div>
                            </div>
                        </div>
                    </div>


                    {/* Tabs / Description */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <div className="flex gap-4 mb-4 border-b border-border">
                            <button type="button" className="pb-2 px-1 text-sm font-semibold border-b-2 border-primary text-primary">Notes</button>
                            <button type="button" className="pb-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground">Instructions</button>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-muted/20 border border-border rounded-md p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Add internal notes..."
                        />
                    </div>
                </form>
            </div>

            {/* Worksheet Drawer (conditionally rendered for animation state management inside it, or just passed prop) */}
            {isEdit && (
                <WorksheetDrawer
                    isOpen={isWorksheetOpen}
                    onClose={() => setIsWorksheetOpen(false)}
                    maintenanceRequestId={initialData?.id}
                    initialLines={initialData?.worksheetLines}
                />
            )}
        </div>
    );
}
