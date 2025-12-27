"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { removeMemberFromTeam } from "@/app/actions/teams";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RemoveMemberButton({
    userId,
    teamId,
}: {
    userId: number;
    teamId: number;
}) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleRemove() {
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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    disabled={isLoading}
                    className="text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors disabled:opacity-50"
                    title="Remove member"
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will remove the user from the team. They will remain in the company but won't be assigned to any team.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
