import { db } from "@/db/index";
import { companies } from "@/db/schema";

export async function getCompanies() {
    return await db.select({ id: companies.id, name: companies.name }).from(companies);
}
