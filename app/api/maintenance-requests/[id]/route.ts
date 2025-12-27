import { NextResponse } from "next/server";
import { getMaintenanceRequestById, updateMaintenanceRequest } from "@/db/maintenance_requests";
import { getCurrentUser } from "@/utils/auth";

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
        if (body.scheduledDate) body.scheduledDate = new Date(body.scheduledDate);
        if (body.requestDate) body.requestDate = new Date(body.requestDate);
        if (body.scrapDate) body.scrapDate = new Date(body.scrapDate);

        const updated = await updateMaintenanceRequest(id, body);
        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
