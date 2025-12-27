import { NextResponse } from "next/server";
import { getTeams, createTeam } from "@/db/teams";
import { getCurrentUser } from "@/utils/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const companyIdParam = searchParams.get("companyId");

        if (!companyIdParam) {
            return NextResponse.json(
                { error: "companyId query parameter is required" },
                { status: 400 }
            );
        }

        const teams = await getTeams(parseInt(companyIdParam));
        return NextResponse.json(teams);
    } catch (error) {
        console.error("Error fetching teams:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

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

        if (user.role !== "manager") {
            return NextResponse.json(
                { error: "Only managers can create teams" },
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
