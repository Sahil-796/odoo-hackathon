import { NextResponse } from "next/server";
import { getEquipmentsByCompanyId, createEquipment } from "@/db/equipments";
import { getCurrentUser } from "@/utils/auth";

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || undefined;

        const equipments = await getEquipmentsByCompanyId(user.companyId, search);
        return NextResponse.json(equipments);
    } catch (error) {
        console.error("Error fetching equipments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.companyId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== 'manager') {
            return NextResponse.json({ error: "Only managers can create equipment" }, { status: 403 });
        }

        const body = await request.json();

        // Ensure companyId is from the authenticated user
        const equipmentData = {
            ...body,
            companyId: user.companyId
        };

        // Basic validation
        if (!equipmentData.name || !equipmentData.serialNumber || !equipmentData.category || !equipmentData.maintenanceTeamId) {
            return NextResponse.json({ error: "Missing required fields (name, serialNumber, category, maintenanceTeamId)" }, { status: 400 });
        }

        const newEquipment = await createEquipment(equipmentData);
        return NextResponse.json(newEquipment, { status: 201 });
    } catch (error) {
        console.error("Error creating equipment:", error);
        // Handle unique constraint violation for serial number
        if (error instanceof Error && error.message.includes("unique constraint")) {
            return NextResponse.json({ error: "Serial number must be unique" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
