import { getCurrentUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { maintenanceRequests } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import CalendarView from "@/components/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
    const user = await getCurrentUser();
    if (!user) return redirect("/login");
    if (!user.companyId) return <div className="p-8 text-center text-muted-foreground">Unauthorized: No company assigned</div>;

    const requests = await db.query.maintenanceRequests.findMany({
        where: and(
            eq(maintenanceRequests.companyId, user.companyId),
            isNotNull(maintenanceRequests.scheduledDate)
        ),
        with: {
            equipment: true,
            technician: true,
        },
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background text-foreground font-sans p-6 md:p-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Maintenance Calendar</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Schedule and track preventive maintenance activities.</p>
                </div>

                <CalendarView requests={requests} />
            </div>
        </div>
    );
}
