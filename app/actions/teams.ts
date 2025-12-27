'use server'

import { db } from "@/db";
import { users, usersToTeams } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function addMemberToTeam(userId: number, teamId: number) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "manager") {
            return { success: false, error: "Unauthorized: Only managers can add members." };
        }

        await db.insert(usersToTeams).values({ userId, teamId }).onConflictDoNothing();
        revalidatePath("/teams");
        revalidatePath(`/teams/${teamId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to add member:", error);
        return { success: false, error: "Failed to add member" };
    }
}

export async function removeMemberFromTeam(userId: number, teamId: number) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "manager") {
            return { success: false, error: "Unauthorized: Only managers can remove members." };
        }

        await db.delete(usersToTeams).where(and(eq(usersToTeams.userId, userId), eq(usersToTeams.teamId, teamId)));
        revalidatePath("/teams");
        revalidatePath(`/teams/${teamId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to remove member:", error);
        return { success: false, error: "Failed to remove member" };
    }
}
