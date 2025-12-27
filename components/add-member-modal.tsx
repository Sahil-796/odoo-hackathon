"use client";

import { useState } from "react";
import { Plus, X, Loader2, UserPlus } from "lucide-react";
import { addMemberToTeam } from "@/app/actions/teams";

type User = {
    id: number;
    name: string;
    email: string;
    teams: { team: { id: number; name: string } | null }[];
};

export default function AddMemberModal({
    users,
    teamId,
}: {
    users: User[];
    teamId: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>("");


    async function handleAdd() {
        if (!selectedUserId) return;
        setIsLoading(true);
        try {
            await addMemberToTeam(parseInt(selectedUserId), teamId);
            setIsOpen(false);
            setSelectedUserId("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
                <UserPlus size={16} />
                Add Member
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-lg shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Add Team Member</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select User</label>
                                <select
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                >
                                    <option value="">Select a user...</option>
                                    {users.map((user) => {
                                        const isCurrentMember = user.teams.some(t => t.team?.id === teamId);
                                        const teamNames = user.teams.map(t => t.team?.name).filter(Boolean).join(", ");
                                        return (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                                disabled={isCurrentMember}
                                            >
                                                {user.name}
                                                {isCurrentMember ? " (Already in team)" :
                                                    teamNames ? ` (In: ${teamNames})` : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    Select a user to add to this team. Users from other teams will be moved.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!selectedUserId || isLoading}
                                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
