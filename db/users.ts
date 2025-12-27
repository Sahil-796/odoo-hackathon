import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";


export async function getUserById(userId: number) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            company: true,
        },
    });
    return user;
}

export async function getUsersByCompany(companyId: number) {
    return await db.query.users.findMany({
        where: eq(users.companyId, companyId),
        with: {
            teams: {
                with: {
                    team: true
                }
            },
        },
    });
}
