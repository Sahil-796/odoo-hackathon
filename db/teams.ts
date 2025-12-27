import { db } from "./index";
import { teams, companies } from "./schema";
import { eq } from "drizzle-orm";

export async function createTeam(teamName: string, companyId: number) {
    try {
        const [newTeam] = await db.insert(teams).values({
            name: teamName,
            companyId: companyId,
        }).returning();
        return newTeam;
    } catch (error) {
        console.error("Error creating team:", error);
        throw new Error("Failed to create team");
    }
}

export async function getTeams(companyId: number) {
    return await db.query.teams.findMany({
        where: eq(teams.companyId, companyId),
        with: {
            members: {
                with: {
                    user: true
                }
            },
            company: true,
        },
    });
}

export async function getCompanies() {
    return await db.select().from(companies);
}

export async function getTeam(teamId: number) {
    return await db.query.teams.findFirst({
        where: eq(teams.id, teamId),
        with: {
            members: {
                with: {
                    user: true
                }
            },
            company: true,
            requests: {
                with: {
                    equipment: true,
                    technician: true,
                }
            }
        },
    });
}
