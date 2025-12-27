import { createTeam } from "@/db/teams";
import { getCurrentUser } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!user.companyId) {
            return NextResponse.json(
                { error: "User is not associated with a company" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Team name is required" },
                { status: 400 }
            );
        }

        // Force team creation under the user's company
        const newTeam = await createTeam(name, user.companyId);
        return NextResponse.json(newTeam, { status: 201 });
    } catch (error) {
        console.error("Error in createTeam route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
