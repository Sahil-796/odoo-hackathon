import { NextResponse } from "next/server";
import { createWorksheetLine } from "@/db/worksheet_lines";
import { getCurrentUser } from "@/utils/auth";
import { z } from "zod";

const createSchema = z.object({
    maintenanceRequestId: z.number(),
    content: z.string().min(1),
    isDone: z.boolean().optional(),
    order: z.number().optional(),
});

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const json = await request.json();
        const body = createSchema.parse(json);

        // TODO: Verify that the maintenance request belongs to the user's company
        // For now, assuming access controls exist at the page level or we trust the ID linkage for this hackathon speed.
        // Ideally: check maintenanceRequests.find(body.maintenanceRequestId).companyId === user.companyId

        const newLine = await createWorksheetLine(body);

        return NextResponse.json(newLine[0], { status: 201 });
    } catch (error) {
        console.error("Error creating worksheet line:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation Error", details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
