"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";

type Option = {
    id: number;
    name: string;
};

type CreateEquipmentModalProps = {
    teams: Option[];
    users: Option[];
    workCenters: Option[];
    companyName: string;
};

export default function CreateEquipmentModal({ teams, users, workCenters, companyName }: CreateEquipmentModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Helper to get value or null
        const getString = (key: string) => formData.get(key) as string;
        const getInt = (key: string) => {
            const val = formData.get(key);
            return val ? parseInt(val as string) : null;
        };

        const payload = {
            name: getString("name"),
            serialNumber: getString("serialNumber") || `SN-${Date.now()}`, // Auto-gen if not provided, though checking if it is in UI
            category: getString("category"),
            maintenanceTeamId: getInt("maintenanceTeamId"),

            // Other fields
            usedBy: getString("usedBy"),
            employeeId: getInt("employeeId"),
            technicianId: getInt("technicianId"), // default_technician_id
            location: getString("location"),
            workCenter: getString("workCenter"), // check if we send ID or name. Schema is text. I'll send name.

            assignedDate: getString("assignedDate"), // Date string
            scrapDate: getString("scrapDate"),
            description: getString("description"),
        };

        try {
            const res = await fetch("/api/equipments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create equipment");
            }

            setIsOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to create equipment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-lg shadow-primary/5 flex items-center gap-2"
            >
                <Plus size={16} />
                New
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-4xl rounded-lg shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-4">
                                <span className="bg-background border border-border px-3 py-1 rounded text-sm font-semibold shadow-sm text-primary">New</span>
                                <h2 className="text-lg font-bold text-foreground">Equipment</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                type="button"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="name" className="text-sm font-semibold text-muted-foreground">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder='e.g. Samsung Monitor 15"'
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="category" className="text-sm font-semibold text-muted-foreground">Equipment Category</label>
                                            <input
                                                type="text"
                                                id="category"
                                                name="category"
                                                required
                                                placeholder="e.g. Monitors"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label className="text-sm font-semibold text-muted-foreground">Company</label>
                                            <div className="text-sm text-foreground py-1">{companyName}</div>
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="usedBy" className="text-sm font-semibold text-muted-foreground">Used By</label>
                                            <select
                                                id="usedBy"
                                                name="usedBy"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                                defaultValue="employee"
                                            >
                                                <option value="employee">Employee</option>
                                                <option value="department">Department</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="maintenanceTeamId" className="text-sm font-semibold text-muted-foreground">Maintenance Team</label>
                                            <select
                                                id="maintenanceTeamId"
                                                name="maintenanceTeamId"
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
                                            <label htmlFor="assignedDate" className="text-sm font-semibold text-muted-foreground">Assigned Date</label>
                                            <input
                                                type="date"
                                                id="assignedDate"
                                                name="assignedDate"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="technicianId" className="text-sm font-semibold text-muted-foreground">Technician</label>
                                            <select
                                                id="technicianId"
                                                name="technicianId"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            >
                                                <option value="">Select Technician</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="employeeId" className="text-sm font-semibold text-muted-foreground">Employee</label>
                                            <select
                                                id="employeeId"
                                                name="employeeId"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            >
                                                <option value="">Select Employee</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="scrapDate" className="text-sm font-semibold text-muted-foreground">Scrap Date</label>
                                            <input
                                                type="date"
                                                id="scrapDate"
                                                name="scrapDate"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="location" className="text-sm font-semibold text-muted-foreground">Used in location</label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                            <label htmlFor="workCenter" className="text-sm font-semibold text-muted-foreground">Work Center</label>
                                            <input
                                                list="workCenters"
                                                id="workCenter"
                                                name="workCenter"
                                                className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors"
                                                placeholder="Select or Type"
                                            />
                                            <datalist id="workCenters">
                                                {workCenters.map(wc => (
                                                    <option key={wc.id} value={wc.name} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <div className="grid grid-cols-[140px_1fr] gap-4">
                                        <label htmlFor="description" className="text-sm font-semibold text-muted-foreground pt-1">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            className="w-full bg-background border-b border-border focus:border-primary px-0 py-1 text-foreground outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="hidden">
                                    {/* Hidden fields needed for API logic if any */}
                                    <input type="hidden" name="serialNumber" value={`SN-${Math.floor(Math.random() * 100000)}`} />
                                </div>

                                <div className="pt-6 flex justify-end gap-3 border-t border-border mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                                        Save Equipment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
