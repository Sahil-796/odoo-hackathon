import { createTeam } from "@/db/teams";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, companyId } = body;

        if (!name || !companyId) {
            return NextResponse.json(
                { error: "Name and Company ID are required" },
                { status: 400 }
            );
        }

        const newTeam = await createTeam(name, companyId);
        return NextResponse.json(newTeam, { status: 201 });
    } catch (error) {
        console.error("Error in createTeam route:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
