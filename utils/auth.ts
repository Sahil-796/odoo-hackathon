import { getUserById } from "@/db/users";

export async function getCurrentUser() {
    // Hardcoded for now as per existing pattern
    return await getUserById(1);
}
