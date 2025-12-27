import { NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionId } from "@/lib/auth";

export async function PUT(request: Request) {
    try {
        const userId = await getSessionId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { id, stage, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const [updatedRequest] = await db.update(maintenanceRequests)
            .set({
                stage,
                ...updates,
                updatedAt: new Date()
            })
            .where(eq(maintenanceRequests.id, id))
            .returning();

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("Error updating maintenance request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
