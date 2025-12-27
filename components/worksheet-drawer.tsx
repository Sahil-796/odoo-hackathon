"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, CheckSquare, Square, GripVertical, Loader2 } from "lucide-react";

type WorksheetLine = {
    id: number;
    content: string;
    isDone: boolean;
    order: number;
    createdAt?: string;
};

interface WorksheetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    maintenanceRequestId: number;
    initialLines?: WorksheetLine[];
}

export default function WorksheetDrawer({ isOpen, onClose, maintenanceRequestId, initialLines = [] }: WorksheetDrawerProps) {
    const [lines, setLines] = useState<WorksheetLine[]>(initialLines);
    const [newLineContent, setNewLineContent] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync initial lines if they change (optional, depending on if parent refresh affects this)
    useEffect(() => {
        setLines(initialLines);
    }, [initialLines]);

    // Focus input when adding
    useEffect(() => {
        if (isOpen && lines.length === 0) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleAddLine = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newLineContent.trim()) return;

        const OptimisticId = -Date.now();
        const content = newLineContent;
        setNewLineContent(""); // Clear immediately for UX

        const optimisticLine: WorksheetLine = {
            id: OptimisticId,
            content,
            isDone: false,
            order: lines.length,
        };

        setLines(prev => [...prev, optimisticLine]);
        setIsAdding(true);

        try {
            const res = await fetch("/api/worksheet-lines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    maintenanceRequestId,
                    content,
                    order: lines.length,
                }),
            });

            if (!res.ok) throw new Error("Failed to add line");
            const savedLine = await res.json();

            setLines(prev => prev.map(l => l.id === OptimisticId ? savedLine : l));
        } catch (error) {
            console.error(error);
            // Revert on error
            setLines(prev => prev.filter(l => l.id !== OptimisticId));
            alert("Failed to add line");
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggleLine = async (id: number, currentStatus: boolean) => {
        // Optimistic
        setLines(prev => prev.map(l => l.id === id ? { ...l, isDone: !currentStatus } : l));

        try {
            await fetch(`/api/worksheet-lines/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isDone: !currentStatus }),
            });
        } catch (error) {
            console.error(error);
            // Revert
            setLines(prev => prev.map(l => l.id === id ? { ...l, isDone: currentStatus } : l));
        }
    };

    const handleDeleteLine = async (id: number) => {
        if (!confirm("Are you sure you want to delete this step?")) return;

        const prevLines = [...lines];
        setLines(prev => prev.filter(l => l.id !== id));

        try {
            await fetch(`/api/worksheet-lines/${id}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error(error);
            setLines(prevLines);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out border-l border-border flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Worksheet</h2>
                        <p className="text-xs text-muted-foreground">Checklist for this maintenance request</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                {/* Content List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {lines.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground space-y-2">
                            <CheckSquare size={48} className="mx-auto opacity-20" />
                            <p>No steps added yet.</p>
                            <p className="text-xs">Add specific tasks for the technician to complete.</p>
                        </div>
                    )}

                    {lines.map((line) => (
                        <div key={line.id} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                            {/* Checkbox */}
                            <button
                                onClick={() => handleToggleLine(line.id, line.isDone)}
                                className={`mt-0.5 flex-shrink-0 transition-colors ${line.isDone ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {line.isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                            </button>

                            {/* Text */}
                            <div className={`flex-1 text-sm pt-0.5 leading-snug transition-all ${line.isDone ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"}`}>
                                {line.content}
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => handleDeleteLine(line.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                                title="Delete step"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Input */}
                <div className="p-4 border-t border-border bg-muted/10">
                    <form onSubmit={handleAddLine} className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newLineContent}
                            onChange={(e) => setNewLineContent(e.target.value)}
                            className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/60"
                            placeholder="Add a new step... (Press Enter)"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!newLineContent.trim() || isAdding}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAdding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
