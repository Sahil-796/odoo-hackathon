"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { removeMemberFromTeam } from "@/app/actions/teams";

export default function RemoveMemberButton({
    userId,
    teamId,
}: {
    userId: number;
    teamId: number;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleRemove() {
        if (!confirm("Are you sure you want to remove this member?")) return;
        setIsLoading(true);
        try {
            await removeMemberFromTeam(userId, teamId);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-destructive hover:text-destructive/80 p-2 rounded-md hover:bg-destructive/10 transition-colors disabled:opacity-50"
            title="Remove member"
        >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
    );
}
