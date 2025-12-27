import { NextResponse } from "next/server";
import { getMaintenanceRequestById, updateMaintenanceRequest } from "@/db/maintenance_requests";
import { getCurrentUser } from "@/utils/auth";
import { db } from "@/db";
import { equipment } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        const req = await getMaintenanceRequestById(id);
        if (!req) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        // Ensure within company
        if (req.companyId !== user.companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        return NextResponse.json(req);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        const body = await request.json();

        const existing = await getMaintenanceRequestById(id);
        if (!existing || existing.companyId !== user.companyId) {
            return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
        }

        // --- SCRAP LOGIC ---
        if (body.stage === "scrap" && existing.equipmentId) {
            await db.update(equipment)
                .set({
                    isScrapped: true,
                    scrapDate: new Date().toISOString().split('T')[0],
                })
                .where(eq(equipment.id, existing.equipmentId));
        }

        // prepare clean update payload
        const updatePayload: any = {};

        // Strings
        if (body.subject !== undefined) updatePayload.subject = body.subject;
        if (body.description !== undefined) updatePayload.description = body.description;
        if (body.category !== undefined) updatePayload.category = body.category;
        if (body.stage !== undefined) updatePayload.stage = body.stage;
        if (body.type !== undefined) updatePayload.type = body.type;
        if (body.maintenanceScope !== undefined) updatePayload.maintenanceScope = body.maintenanceScope;

        // Numbers (handle potentially empty strings or nulls)
        if (body.priority !== undefined) updatePayload.priority = Number(body.priority);
        if (body.duration !== undefined) updatePayload.duration = body.duration ? Number(body.duration) : null;
        if (body.equipmentId !== undefined) updatePayload.equipmentId = body.equipmentId ? Number(body.equipmentId) : null;
        if (body.workCenterId !== undefined) updatePayload.workCenterId = body.workCenterId ? Number(body.workCenterId) : null;
        if (body.teamId !== undefined) updatePayload.teamId = body.teamId ? Number(body.teamId) : null;
        if (body.technicianId !== undefined) updatePayload.technicianId = body.technicianId ? Number(body.technicianId) : null;

        // Dates
        // requestDate: must be string YYYY-MM-DD for 'date' column
        if (body.requestDate) {
            updatePayload.requestDate = new Date(body.requestDate).toISOString().split('T')[0];
        }
        // scheduledDate: can be Date object for 'timestamp' column
        if (body.scheduledDate) {
            updatePayload.scheduledDate = new Date(body.scheduledDate);
        }

        const updated = await updateMaintenanceRequest(id, updatePayload);
        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error("Error updating maintenance request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
