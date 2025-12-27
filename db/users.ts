import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId: number) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });
    return user;
}
