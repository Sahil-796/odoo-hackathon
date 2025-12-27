'use client'

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl rounded-lg shadow-xl border border-border flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold">Create Work Center</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <form id="work-center-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.name || ""}
                                onChange={e => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code</label>
                            <input
                                type="text"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.code || ""}
                                onChange={e => handleInputChange('code', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tag</label>
                            <input
                                type="text"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.tag || ""}
                                onChange={e => handleInputChange('tag', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alternative Work Center</label>
                            <select
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.alternativeWorkCenterId || ""}
                                onChange={e => handleInputChange('alternativeWorkCenterId', e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <option value="">None</option>
                                {existingWorkCenters.map(wc => (
                                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cost per hour</label>
                            <input
                                type="number"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.costperhour || 0}
                                onChange={e => handleInputChange('costperhour', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Capacity</label>
                            <input
                                type="number"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.capacity || 0}
                                onChange={e => handleInputChange('capacity', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time Efficiency</label>
                            <input
                                type="number"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.timeEfficiency || 0}
                                onChange={e => handleInputChange('timeEfficiency', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">OEE Target</label>
                            <input
                                type="number"
                                className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                value={formData.oeeTarget || 0}
                                onChange={e => handleInputChange('oeeTarget', parseFloat(e.target.value))}
                            />
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="work-center-form"
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Create Work Center"}
                    </button>
                </div>
            </div>
        </div>
    );
}
