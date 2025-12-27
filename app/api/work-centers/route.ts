import { db } from '@/db';
import { workCenters } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getSessionId } from '@/lib/auth';

export async function GET() {
    try {
        const userId = await getSessionId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const allWorkCenters = await db.select().from(workCenters);
        return NextResponse.json(allWorkCenters);
    } catch (error) {
        console.error('Error fetching work centers:', error);
        return NextResponse.json({ error: 'Failed to fetch work centers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getSessionId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();

        // Validate or clean body if necessary, for now assuming it matches schema or letting DB throw
        const newWorkCenter = await db.insert(workCenters).values({
            name: body.name,
            code: body.code,
            tag: body.tag,
            costperhour: body.costperhour,
            capacity: body.capacity,
            timeEfficiency: body.timeEfficiency,
            oeeTarget: body.oeeTarget,
            alternativeWorkCenterId: body.alternativeWorkCenterId || null,
        }).returning();

        return NextResponse.json(newWorkCenter[0]);
    } catch (error) {
        console.error('Error creating work center:', error);
        return NextResponse.json({ error: 'Failed to create work center' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const userId = await getSessionId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
        }

        const { id, ...data } = body;

        const updatedWorkCenter = await db.update(workCenters)
            .set({
                name: data.name,
                code: data.code,
                tag: data.tag,
                costperhour: data.costperhour,
                capacity: data.capacity,
                timeEfficiency: data.timeEfficiency,
                oeeTarget: data.oeeTarget,
                alternativeWorkCenterId: data.alternativeWorkCenterId || null,
            })
            .where(eq(workCenters.id, id))
            .returning();

        return NextResponse.json(updatedWorkCenter[0]);
    } catch (error) {
        console.error('Error updating work center:', error);
        return NextResponse.json({ error: 'Failed to update work center' }, { status: 500 });
    }
}
