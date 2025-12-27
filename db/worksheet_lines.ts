import { db } from "./index";
import { worksheetLines } from "./schema";
import { eq, asc, type InferInsertModel } from "drizzle-orm";

export type NewWorksheetLine = InferInsertModel<typeof worksheetLines>;

export async function createWorksheetLine(data: NewWorksheetLine) {
    return await db.insert(worksheetLines).values(data).returning();
}

export async function getWorksheetLines(maintenanceRequestId: number) {
    return await db.query.worksheetLines.findMany({
        where: eq(worksheetLines.maintenanceRequestId, maintenanceRequestId),
        orderBy: [asc(worksheetLines.order), asc(worksheetLines.createdAt)],
    });
}

export async function updateWorksheetLine(id: number, data: Partial<NewWorksheetLine>) {
    return await db.update(worksheetLines)
        .set(data)
        .where(eq(worksheetLines.id, id))
        .returning();
}

export async function deleteWorksheetLine(id: number) {
    return await db.delete(worksheetLines)
        .where(eq(worksheetLines.id, id))
        .returning();
}
