import { db } from "./index";
import { maintenanceRequests, equipment } from "./schema";
import { eq, desc, type InferInsertModel } from "drizzle-orm";

export type NewMaintenanceRequest = InferInsertModel<typeof maintenanceRequests>;

export async function createMaintenanceRequest(data: NewMaintenanceRequest) {
    return await db.insert(maintenanceRequests).values(data).returning();
}

export async function getMaintenanceRequestById(id: number) {
    return await db.query.maintenanceRequests.findFirst({
        where: eq(maintenanceRequests.id, id),
        with: {
            equipment: true,
            technician: true,
            team: true,
            workCenter: true,
            createdBy: true,
            company: true,
            worksheetLines: {
                orderBy: (lines, { asc }) => [asc(lines.order), asc(lines.createdAt)]
            }
        }
    });
}

export async function updateMaintenanceRequest(id: number, data: Partial<NewMaintenanceRequest>) {
    return await db.update(maintenanceRequests)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(maintenanceRequests.id, id))
        .returning();
}
