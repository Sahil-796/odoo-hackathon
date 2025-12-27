import { getUserById } from "@/db/users";

import { getSessionId } from "@/lib/auth";

export async function getCurrentUser() {
    const userId = await getSessionId();
    if (!userId) return null;
    return await getUserById(userId);
}
