import { NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceRequests } from "@/db/schema";

export async function GET(request: Request) {
    try {
        // Fetch all maintenance requests with necessary relations
        // Using db.query.maintenanceRequests.findMany is cleaner for relations
        const requests = await db.query.maintenanceRequests.findMany({
            with: {
                equipment: true,
                technician: true,
                company: true,
                workCenter: true
                // team relation is not defined in requestsRelations in schema, skipping for now to fix lint
            },
            orderBy: (requests, { desc }) => [desc(requests.createdAt)],
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
