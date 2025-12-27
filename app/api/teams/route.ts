import { NextResponse } from "next/server";
import { getTeams } from "@/db/teams";

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
