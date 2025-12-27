'use client'

import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
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



    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">

            {/* Navigation (Simplified for this component, ideally shared) */}
            <nav className="flex items-center gap-6 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="text-foreground font-bold text-lg mr-4">Maintenance</div>
                <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
                <a href="#" className="text-foreground hover:text-primary transition-colors">Work Centers</a>
                {/* Other links omitted for brevity in this focused view */}
            </nav>

            <main className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-bold">Work Centers</h1>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCreateClick}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-semibold text-sm transition-colors shadow-lg shadow-primary/5 flex items-center gap-2"
                        >
                            <Plus size={16} /> Create
                        </button>
                    </div>

                    <WorkCenterDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onSave={handleCreateSave}
                        existingWorkCenters={workCenters}
                    />
                </div>

                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-muted-foreground">
                            <thead className="bg-muted/50 text-foreground uppercase text-xs tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border-b border-border min-w-[200px]">Work Center</th>
                                    <th className="px-6 py-4 border-b border-border">Code</th>
                                    <th className="px-6 py-4 border-b border-border">Tag</th>
                                    <th className="px-6 py-4 border-b border-border">Alternative Workcenters</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Cost per hour</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Capacity</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Time Efficiency</th>
                                    <th className="px-6 py-4 border-b border-border text-right">OEE Target</th>
                                    <th className="px-6 py-4 border-b border-border text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {workCenters.map((wc) => (
                                    <tr key={wc.id} className="hover:bg-muted/30 transition-colors group">
                                        {editingId === wc.id ? (
                                            // --- EDIT MODE ---
                                            <>
                                                <td className="p-2">

                                                    <input
                                                        type="text"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground"
                                                        value={editForm.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">

                                                    <input
                                                        type="text"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground"
                                                        value={editForm.code || ""}
                                                        onChange={(e) => handleInputChange('code', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">

                                                    <input
                                                        type="text"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground"
                                                        value={editForm.tag || ""}
                                                        onChange={(e) => handleInputChange('tag', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">

                                                    <select
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground"
                                                        value={editForm.alternativeWorkCenterId || ""}
                                                        onChange={(e) => handleInputChange('alternativeWorkCenterId', e.target.value ? parseInt(e.target.value) : null)}
                                                    >
                                                        <option value="">None</option>
                                                        {workCenters
                                                            .filter(w => w.id !== editForm.id && w.id !== -1) // Exclude self and temp items
                                                            .map(w => (
                                                                <option key={w.id} value={w.id}>
                                                                    {w.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </td>
                                                <td className="p-2 text-right">

                                                    <input
                                                        type="number"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground text-right"
                                                        value={editForm.costperhour || 0}
                                                        onChange={(e) => handleInputChange('costperhour', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2 text-right">

                                                    <input
                                                        type="number"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground text-right"
                                                        value={editForm.capacity || 0}
                                                        onChange={(e) => handleInputChange('capacity', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2 text-right">

                                                    <input
                                                        type="number"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground text-right"
                                                        value={editForm.timeEfficiency || 0}
                                                        onChange={(e) => handleInputChange('timeEfficiency', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-2 text-right">

                                                    <input
                                                        type="number"
                                                        className="bg-muted px-2 py-1 rounded w-full border border-border focus:border-primary outline-none text-foreground text-right"
                                                        value={editForm.oeeTarget || 0}
                                                        onChange={(e) => handleInputChange('oeeTarget', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={handleSaveClick} className="text-green-500 hover:text-green-400 p-1"><Save size={18} /></button>
                                                        <button onClick={handleCancelClick} className="text-red-500 hover:text-red-400 p-1"><X size={18} /></button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // --- VIEW MODE ---
                                            <>
                                                <td className="px-6 py-4 font-medium text-foreground cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.name}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.code}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.tag}</td>
                                                <td className="px-6 py-4 cursor-pointer" onClick={() => handleEditClick(wc)}>
                                                    {wc.alternativeWorkCenterId
                                                        ? workCenters.find(w => w.id === wc.alternativeWorkCenterId)?.name || "Unknown"
                                                        : "-"}
                                                </td>
                                                <td className="px-6 py-4 text-right cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.costperhour?.toFixed(2) ?? "0.00"}</td>
                                                <td className="px-6 py-4 text-right cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.capacity?.toFixed(2) ?? "0.00"}</td>
                                                <td className="px-6 py-4 text-right cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.timeEfficiency?.toFixed(2) ?? "0.00"}</td>
                                                <td className="px-6 py-4 text-right cursor-pointer" onClick={() => handleEditClick(wc)}>{wc.oeeTarget?.toFixed(2) ?? "0.00"}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleEditClick(wc)} className="text-xs hover:text-primary underline">Edit</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
