import { db } from "@/db";
import { maintenanceRequests, equipment, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { ArrowLeft, Wrench, AlertCircle, CheckCircle, Clock, Filter, Monitor, User } from "lucide-react";

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

export default async function MaintenanceRequestsPage({ searchParams }: { searchParams: Promise<{ equipmentId?: string }> }) {
    const user = await getCurrentUser();
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
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-8 selection:bg-primary/30">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    {equipmentId && (
                        <Link href={`/equipments/${equipmentId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group w-fit">
                            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to {equipmentName}
                        </Link>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Wrench className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Maintenance Operations</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Maintenance Requests</h1>
                            <p className="text-muted-foreground mt-1 text-sm font-medium">Track and manage service requests across your facility.</p>
                        </div>
                        {equipmentName && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium text-primary">
                                <Filter size={14} />
                                <span>Filtering: {equipmentName}</span>
                                <Link href="/maintenance-requests" className="ml-2 hover:bg-primary/20 p-0.5 rounded-full transition-colors">
                                    <div className="sr-only">Clear filter</div>
                                    <ArrowLeft size={12} className="rotate-180" />
                                    {/* Using generic clear icon style, actually X might be better but let's stick to simple text or close icon */}
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link
                        href={`/maintenance-requests/new${equipmentId ? `?equipmentId=${equipmentId}` : ""}`}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-semibold text-sm transition-colors shadow-lg shadow-primary/5 flex items-center gap-2"
                    >
                        <Wrench size={16} />
                        New Request
                    </Link>
                </div>

                {/* List */}
                <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider font-bold border-b border-border/60">
                                <tr>
                                    <th className="px-6 py-4 min-w-[300px]">Subject</th>
                                    <th className="px-6 py-4">Equipment</th>
                                    <th className="px-6 py-4">Technician</th>
                                    <th className="px-6 py-4">Stage</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-3 rounded-full bg-muted/50">
                                                    <CheckCircle className="w-6 h-6 text-emerald-500/50" />
                                                </div>
                                                <p>No maintenance requests found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">{req.subject}</div>
                                                {req.description && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-md opacity-80">{req.description}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                    <Monitor className="w-3.5 h-3.5 text-muted-foreground opacity-70" />
                                                    {req.equipment?.name || "-"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="w-3.5 h-3.5 text-muted-foreground opacity-70" />
                                                    {req.technician ? (
                                                        <span className="text-foreground/80">{req.technician.name}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground italic text-xs">Unassigned</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={req.stage} />
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
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
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        new: "bg-blue-500/10 text-blue-600 border-blue-200/50",
        in_progress: "bg-amber-500/10 text-amber-600 border-amber-200/50",
        repaired: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
        scrap: "bg-red-500/10 text-red-600 border-red-200/50",
    };

    const label = status.replace("_", " ");
    const style = styles[status] || "bg-muted/50 text-muted-foreground border-border/50";

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${style}`}>
            {label}
        </span>
    );
}
