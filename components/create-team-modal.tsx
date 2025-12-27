"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Loader2 } from "lucide-react";

type Company = {
    id: number;
    name: string;
};

export default function CreateTeamModal({ companyId, companyName }: { companyId: number; companyName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        try {
            const res = await fetch("/api/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, companyId }),
            });

            if (!res.ok) {
                throw new Error("Failed to create team");
            }

            setIsOpen(false);
            router.refresh();
        } catch (err) {
            setError("Failed to create team. Please try again.");
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
                    <div className="bg-card w-full max-w-md rounded-lg shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Create New Team</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                type="button"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                                    Creating team for <span className="font-semibold">{companyName}</span>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Team Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="e.g. Maintenance A"
                                        className="w-full bg-muted border border-border rounded px-3 py-2 outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Company is now fixed to the user's company */}
                                <input type="hidden" name="companyId" value={companyId} />

                                <div className="pt-4 flex justify-end gap-3">
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
                                        Create
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
