import { db } from "@/db";
import { maintenanceRequests, equipment, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { ArrowLeft, Wrench, AlertCircle, CheckCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

async function getRequests(companyId: number, equipmentId?: number) {
    const whereClause = equipmentId
        ? and(eq(maintenanceRequests.companyId, companyId), eq(maintenanceRequests.equipmentId, equipmentId))
        : eq(maintenanceRequests.companyId, companyId);

    return await db.query.maintenanceRequests.findMany({
        where: whereClause,
        orderBy: [desc(maintenanceRequests.createdAt)],
        with: {
            equipment: true,
            technician: true
        }
    });
}

export default async function MaintenanceRequestsPage({ searchParams }: { searchParams: { equipmentId?: string } }) {
    const user = await getCurrentUser();

    // Await params for nextjs compatibility
    const resolvedSearchParams = await searchParams;
    const equipmentId = resolvedSearchParams.equipmentId ? parseInt(resolvedSearchParams.equipmentId) : undefined;

    if (!user || !user.companyId) {
        return <div>Unauthorized</div>;
    }

    const requests = await getRequests(user.companyId, equipmentId);

    // If filtering by equipment, get its name for the header
    let equipmentName = "";
    if (equipmentId) {
        const eqItem = await db.query.equipment.findFirst({
            where: eq(equipment.id, equipmentId),
            columns: { name: true }
        });
        equipmentName = eqItem?.name || "";
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    {equipmentId && (
                        <Link href={`/equipments/${equipmentId}`} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted/50">
                            <ArrowLeft size={20} />
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Wrench className="w-6 h-6 text-primary" />
                            Maintenance Requests
                        </h1>
                        {equipmentName && (
                            <p className="text-muted-foreground text-sm mt-1">
                                Filtering for equipment: <span className="font-semibold text-foreground">{equipmentName}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xl">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/50 text-foreground uppercase text-xs tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4 border-b border-border">Subject</th>
                                <th className="px-6 py-4 border-b border-border">Equipment</th>
                                <th className="px-6 py-4 border-b border-border">Technician</th>
                                <th className="px-6 py-4 border-b border-border">Stage</th>
                                <th className="px-6 py-4 border-b border-border">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="bg-muted rounded-full p-4">
                                                <CheckCircle className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <p>No maintenance requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {req.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.equipment?.name || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.technician?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={req.stage} />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        new: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
        in_progress: "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20",
        repaired: "bg-green-500/10 text-green-500 ring-green-500/20",
        scrap: "bg-red-500/10 text-red-500 ring-red-500/20",
    };

    const label = status.replace("_", " ");
    const style = styles[status] || "bg-gray-500/10 text-gray-500 ring-gray-500/20";

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset uppercase tracking-wide ${style}`}>
            {label}
        </span>
    );
}
