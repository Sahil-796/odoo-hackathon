'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addMemberToTeam(userId: number, teamId: number) {
    try {
        await db.update(users).set({ teamId }).where(eq(users.id, userId));
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
        await db.update(users).set({ teamId: null }).where(eq(users.id, userId));
        revalidatePath("/teams");
        revalidatePath(`/teams/${teamId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to remove member:", error);
        return { success: false, error: "Failed to remove member" };
    }
}
