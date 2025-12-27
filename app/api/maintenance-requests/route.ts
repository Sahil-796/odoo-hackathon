import { NextResponse } from "next/server";
import { createMaintenanceRequest } from "@/db/maintenance_requests";
import { getCurrentUser } from "@/utils/auth";
import { z } from "zod";

const createSchema = z.object({
    subject: z.string().min(1),
    maintenanceScope: z.enum(["equipment", "work_center", "other"]).optional(),
    equipmentId: z.number().optional().nullable(),
    workCenterId: z.number().optional().nullable(),
    category: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    instruction: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    teamId: z.number(),
    technicianId: z.number().optional().nullable(),
    type: z.enum(["corrective", "preventive"]),
    priority: z.coerce.number().optional(),
    scheduledDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
    duration: z.coerce.number().optional().nullable(),
    requestDate: z.string().optional().transform(val => val || new Date().toISOString().split('T')[0]), // Returns YYYY-MM-DD string
});

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const json = await request.json();
        const body = createSchema.parse(json);

        const newRequest = await createMaintenanceRequest({
            ...body,
            companyId: user.companyId,
            createdBy: user.id,
            stage: "new",
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating maintenance request:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation Error", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
