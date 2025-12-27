import { db } from "./index";
import { workCenters } from "./schema";

export async function getWorkCenters() {
    // Assuming work centers are not company-scoped for now as per schema
    return await db.select().from(workCenters);
}
