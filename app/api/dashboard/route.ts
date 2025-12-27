import { NextResponse } from "next/server";
import { db } from "@/db";
import { maintenanceRequests } from "@/db/schema";
import { getSessionId } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const userId = await getSessionId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Fetch all maintenance requests with relations
        const requests = await db.query.maintenanceRequests.findMany({
            with: {
                equipment: {
                    with: {
                        employee: true
                    }
                },
                technician: true,
                company: true,
                workCenter: true,
                team: true
            },
            orderBy: (requests, { desc }) => [desc(requests.createdAt)],
        });

        // Calculate Stats
        // 1. Total Technicians
        const allTechnicians = await db.query.users.findMany({
            where: (users, { eq }) => eq(users.role, "technician"),
        });
        const totalTechnicians = allTechnicians.length;

        // 2. Active Technicians (unique IDs from active requests)
        const activeRequests = requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap');
        const activeTechnicianIds = new Set(
            activeRequests
                .map(r => r.technicianId)
                .filter(id => id !== null)
        );
        const activeTechnicians = activeTechnicianIds.size;

        // 3. Critical Equipment (unique equipment with active high-priority requests)
        const criticalEquipmentIds = new Set(
            activeRequests
                .filter(r => (r.priority || 0) > 1 && r.equipmentId)
                .map(r => r.equipmentId)
        );
        const criticalEquipmentCount = criticalEquipmentIds.size;

        return NextResponse.json({
            requests,
            stats: {
                totalTechnicians,
                activeTechnicians,
                criticalEquipmentCount,
                overdueRequestCount: activeRequests.filter(r => {
                    const isOverdue = r.scheduledDate ? new Date(r.scheduledDate) < new Date() : false;
                    // Fallback: if no schedule, consider overdue if created > 7 days ago
                    const isLongPending = !r.scheduledDate && r.createdAt && (new Date().getTime() - new Date(r.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000);
                    return isOverdue || isLongPending;
                }).length
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
