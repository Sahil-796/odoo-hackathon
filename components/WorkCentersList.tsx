'use client'

import React, { useState } from 'react';
import { Loader2, Plus, Save, X, Factory, Pencil, Trash2 } from 'lucide-react';
import { WorkCenter } from '@/db/schema';
import WorkCenterDialog from './WorkCenterDialog';

export default function WorkCentersList() {
    const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]); // Initialize empty, will fetch
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<WorkCenter>>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    React.useEffect(() => {
        fetchWorkCenters();
    }, []);

    const fetchWorkCenters = async () => {
        try {
            const response = await fetch('/api/work-centers');
            if (response.ok) {
                const data = await response.json();
                setWorkCenters(data);
            } else {
                console.error('Failed to fetch work centers');
            }
        } catch (error) {
            console.error('Error loading work centers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (wc: WorkCenter) => {
        setEditingId(wc.id);
        setEditForm({ ...wc });
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveClick = async () => {
        try {
            if (editingId) {
                // Update
                const response = await fetch('/api/work-centers', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editForm),
                });
                if (!response.ok) throw new Error('Failed to update');
                const savedData = await response.json();

                // Update the row
                setWorkCenters(prev => prev.map(w => w.id === savedData.id ? savedData : w));
            }

            setEditingId(null);
            setEditForm({});
        } catch (error) {
            console.error('Error saving work center:', error);
        }
    };

    const handleInputChange = (field: keyof WorkCenter, value: WorkCenter[keyof WorkCenter]) => {
        setEditForm({ ...editForm, [field]: value });
    };

    const handleCreateClick = () => {
        setIsDialogOpen(true);
    };

    const handleCreateSave = async (data: Partial<WorkCenter>) => {
        const response = await fetch('/api/work-centers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create');
        const savedData = await response.json();
        setWorkCenters([...workCenters, savedData]);
    };



    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background/50 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Work Centers</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Configure and manage manufacturing work centers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <WorkCenterDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onSave={handleCreateSave}
                        existingWorkCenters={workCenters}
                    />
                    <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold text-sm transition-all shadow-sm shadow-primary/20"
                    >
                        <Plus size={16} /> Create New
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-bold border-b border-border/60">
                            <tr>
                                <th className="px-6 py-4 min-w-[180px]">Work Center Name</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Tag</th>
                                <th className="px-6 py-4">Alt. Center</th>
                                <th className="px-6 py-4 text-right">Cost/Hr</th>
                                <th className="px-6 py-4 text-right">Capacity</th>
                                <th className="px-6 py-4 text-right">Efficiency</th>
                                <th className="px-6 py-4 text-right">OEE Target</th>
                                <th className="px-6 py-4 text-right w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {workCenters.map((wc) => (
                                <tr key={wc.id} className="hover:bg-muted/50 transition-colors group">
                                    {editingId === wc.id ? (
                                        // --- EDIT MODE ---
                                        <>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                        <Factory size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="bg-background/50 px-3 py-1.5 rounded-md w-full border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                                        value={editForm.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        placeholder="Name"
                                                        autoFocus
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-24 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                                                    value={editForm.code || ""}
                                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-24 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                                                    value={editForm.tag || ""}
                                                    onChange={(e) => handleInputChange('tag', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-full border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                                                    value={editForm.alternativeWorkCenterId || ""}
                                                    onChange={(e) => handleInputChange('alternativeWorkCenterId', e.target.value ? parseInt(e.target.value) : null)}
                                                >
                                                    <option value="">None</option>
                                                    {workCenters
                                                        .filter(w => w.id !== editForm.id && w.id !== -1)
                                                        .map(w => (
                                                            <option key={w.id} value={w.id}>
                                                                {w.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-20 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm text-right"
                                                    value={editForm.costperhour || 0}
                                                    onChange={(e) => handleInputChange('costperhour', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-20 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm text-right"
                                                    value={editForm.capacity || 0}
                                                    onChange={(e) => handleInputChange('capacity', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-20 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm text-right"
                                                    value={editForm.timeEfficiency || 0}
                                                    onChange={(e) => handleInputChange('timeEfficiency', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <input
                                                    type="number"
                                                    className="bg-background/50 px-3 py-1.5 rounded-md w-20 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm text-right"
                                                    value={editForm.oeeTarget || 0}
                                                    onChange={(e) => handleInputChange('oeeTarget', parseFloat(e.target.value))}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={handleSaveClick} className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-500/10 transition-colors" title="Save">
                                                        <Save size={16} />
                                                    </button>
                                                    <button onClick={handleCancelClick} className="p-1.5 rounded-md text-rose-600 hover:bg-rose-500/10 transition-colors" title="Cancel">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        // --- VIEW MODE ---
                                        <>
                                            <td className="px-6 py-4 cursor-pointer" onClick={() => handleEditClick(wc)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-md bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <Factory size={16} />
                                                    </div>
                                                    <span className="font-semibold text-foreground">{wc.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" onClick={() => handleEditClick(wc)}>
                                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{wc.code}</span>
                                            </td>
                                            <td className="px-6 py-4" onClick={() => handleEditClick(wc)}>
                                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/10">
                                                    {wc.tag}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground" onClick={() => handleEditClick(wc)}>
                                                {wc.alternativeWorkCenterId
                                                    ? workCenters.find(w => w.id === wc.alternativeWorkCenterId)?.name || "Unknown"
                                                    : <span className="opacity-30">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium" onClick={() => handleEditClick(wc)}>${wc.costperhour?.toFixed(2) ?? "0.00"}</td>
                                            <td className="px-6 py-4 text-right text-muted-foreground" onClick={() => handleEditClick(wc)}>{wc.capacity?.toFixed(0) ?? "0"}</td>
                                            <td className="px-6 py-4 text-right" onClick={() => handleEditClick(wc)}>
                                                <span className={`${(wc.timeEfficiency || 0) < 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {wc.timeEfficiency?.toFixed(0) ?? "0"}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-foreground" onClick={() => handleEditClick(wc)}>{wc.oeeTarget?.toFixed(0) ?? "0"}%</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEditClick(wc)}
                                                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {workCenters.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            No work centers found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
