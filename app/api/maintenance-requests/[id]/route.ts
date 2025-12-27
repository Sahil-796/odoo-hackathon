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

        // Validation: user can update if manager or if tech assigned?
        // Requirement: "this req are made by manager and updates could also be made by technician for updating stage"
        // So we allow updates. Real app might check `req.technicianId === user.id` if not manager. 
        // For now, if same company, allow.

        const existing = await getMaintenanceRequestById(id);
        if (!existing || existing.companyId !== user.companyId) {
            return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
        }

        // Clean fields
        // Convert date strings to Date objects if present
        // Convert date strings to Date objects if present
        // 'scheduledDate' is timestamp -> Date object
        if (body.scheduledDate) body.scheduledDate = new Date(body.scheduledDate);

        // 'requestDate' and 'scrapDate' are date -> String (YYYY-MM-DD)
        // Ensure we strictly format them or just pass them if they are already strings (from JSON)
        // But to be safe, if they come in as full ISO strings, slice them.
        if (body.requestDate) body.requestDate = new Date(body.requestDate).toISOString().split('T')[0];
        if (body.scrapDate) body.scrapDate = new Date(body.scrapDate).toISOString().split('T')[0];

        // --- SCRAP LOGIC ---
        // If moving to "scrap" stage, ensure equipment is marked as scrapped.
        if (body.stage === "scrap" && existing.equipmentId) {
            await db.update(equipment)
                .set({
                    isScrapped: true,
                    scrapDate: new Date().toISOString().split('T')[0], // Set current date as scrap date
                })
                .where(eq(equipment.id, existing.equipmentId));
        }
        // -------------------

        const updated = await updateMaintenanceRequest(id, body);
        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
