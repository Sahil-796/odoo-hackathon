'use client'

import React, { useState } from 'react';
import { X, Save, Factory } from 'lucide-react';
import { WorkCenter } from '@/db/schema';

interface WorkCenterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<WorkCenter>) => Promise<void>;
    existingWorkCenters: WorkCenter[];
}

export default function WorkCenterDialog({ isOpen, onClose, onSave, existingWorkCenters }: WorkCenterDialogProps) {
    const [formData, setFormData] = useState<Partial<WorkCenter>>({
        name: "",
        code: "",
        tag: "General",
        costperhour: 0,
        capacity: 100,
        timeEfficiency: 100,
        oeeTarget: 80,
        alternativeWorkCenterId: null,
    });
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (field: keyof WorkCenter, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
            // Reset form for next time (optional, or rely on unmount if parent handles it)
            setFormData({
                name: "",
                code: "",
                tag: "General",
                costperhour: 0,
                capacity: 100,
                timeEfficiency: 100,
                oeeTarget: 80,
                alternativeWorkCenterId: null,
            })
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background/95 backdrop-blur-xl w-full max-w-2xl rounded-xl shadow-2xl border border-border/50 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Factory size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Create Work Center</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Add details for a new production unit.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <form id="work-center-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-muted-foreground/50"
                                placeholder="e.g. Assembly Line A"
                                value={formData.name || ""}
                                onChange={e => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code</label>
                            <input
                                type="text"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-muted-foreground/50"
                                placeholder="e.g. WC-001"
                                value={formData.code || ""}
                                onChange={e => handleInputChange('code', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tag</label>
                            <input
                                type="text"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium placeholder:text-muted-foreground/50"
                                placeholder="e.g. Assembly"
                                value={formData.tag || ""}
                                onChange={e => handleInputChange('tag', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alternative Work Center</label>
                            <select
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
                                value={formData.alternativeWorkCenterId || ""}
                                onChange={e => handleInputChange('alternativeWorkCenterId', e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <option value="">None</option>
                                {existingWorkCenters.map(wc => (
                                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t border-border/40 my-2"></div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost per hour ($)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium text-right"
                                value={formData.costperhour || 0}
                                onChange={e => handleInputChange('costperhour', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capacity (Units)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium text-right"
                                value={formData.capacity || 0}
                                onChange={e => handleInputChange('capacity', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Efficiency (%)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium text-right"
                                value={formData.timeEfficiency || 0}
                                onChange={e => handleInputChange('timeEfficiency', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">OEE Target (%)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/40 border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium text-right"
                                value={formData.oeeTarget || 0}
                                onChange={e => handleInputChange('oeeTarget', parseFloat(e.target.value))}
                            />
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/10 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="work-center-form"
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <Save size={18} />
                                Create Work Center
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
