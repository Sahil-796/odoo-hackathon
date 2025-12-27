import { db } from "./index";
import { equipment, maintenanceRequests } from "./schema";
import { eq, ilike, and, or, desc, type InferInsertModel, count } from "drizzle-orm";

export type NewEquipment = InferInsertModel<typeof equipment>;

export async function createEquipment(data: NewEquipment) {
    return await db.insert(equipment).values(data).returning();
}

export async function getEquipmentsByCompanyId(companyId: number, search?: string) {
    const whereClause = search
        ? and(
            eq(equipment.companyId, companyId),
            or(
                ilike(equipment.name, `%${search}%`),
                ilike(equipment.serialNumber, `%${search}%`),
                ilike(equipment.category, `%${search}%`)
            )
        )
        : eq(equipment.companyId, companyId);

    return await db.query.equipment.findMany({
        where: whereClause,
        orderBy: [desc(equipment.id)],
        with: {
            team: true,
            employee: true
        }
    });
}

export async function getEquipmentById(id: number) {
    const item = await db.query.equipment.findFirst({
        where: eq(equipment.id, id),
        with: {
            team: true,
            employee: true,
            requests: true // Include requests to count them or we can do a separate count query if optimization needed
        }
    });

    if (!item) return null;

    // Calculate simple stats
    const maintenanceCount = item.requests.length;

    return {
        ...item,
        maintenanceCount
    };
}
