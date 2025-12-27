import { db } from "@/db";
import { maintenanceRequests, equipment, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { ArrowLeft, Wrench, CheckCircle2, Clock, Calendar, Search, Filter } from "lucide-react";

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
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access</div>;
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
        <div className="min-h-screen bg-gray-50/50 dark:bg-background text-foreground font-sans p-6 pb-20">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {equipmentId && (
                            <Link href={`/equipments/${equipmentId}`} className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted/50">
                                <ArrowLeft size={20} />
                            </Link>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <Wrench className="w-8 h-8 text-primary" />
                                Maintenance Requests
                            </h1>
                            {equipmentName ? (
                                <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                                    Filtering for <span className="font-semibold text-foreground px-2 py-0.5 bg-muted rounded-md">{equipmentName}</span>
                                </p>
                            ) : (
                                <p className="text-muted-foreground text-lg mt-1">
                                    Manage and track all maintenance activities.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        <Link
                            href={`/maintenance-requests/new${equipmentId ? `?equipmentId=${equipmentId}` : ""}`}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center gap-2 whitespace-nowrap active:scale-95"
                        >
                            <Wrench size={18} />
                            New Request
                        </Link>
                    </div>
                </div>

                {/* Filters / Search Bar Placeholder (Visual only for now) */}
                <div className="flex items-center gap-4 bg-card border border-border/60 p-1 rounded-xl shadow-sm max-w-md">
                    <div className="pl-3 text-muted-foreground">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search requests..."
                        className="bg-transparent border-none outline-none text-sm w-full h-10 placeholder:text-muted-foreground/70"
                    />
                    <button className="px-3 py-1.5 text-xs font-medium bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-colors mr-1">
                        Filters
                    </button>
                </div>

                {/* List */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Subject</th>
                                    <th className="px-6 py-4 font-medium">Equipment</th>
                                    <th className="px-6 py-4 font-medium">Technician</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="bg-muted/50 p-4 rounded-full">
                                                    <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium text-foreground">No maintenance requests found</p>
                                                    <p className="text-sm">Create a new request to get started.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link href={`/maintenance-requests/${req.id}`} className="block">
                                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-base block mb-0.5">
                                                        {req.subject}
                                                    </span>
                                                    {req.priority && (req.priority > 0) && (
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${req.priority === 3 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                req.priority === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            }`}>
                                                            {['Low', 'Medium', 'High', 'Urgent'][req.priority]} Priority
                                                        </span>
                                                    )}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.equipment ? (
                                                    <Link href={`/equipments/${req.equipment.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group/eq">
                                                        <span className="font-medium">{req.equipment.name}</span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted-foreground italic">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border">
                                                        {req.technician?.avatarUrl ? (
                                                            <img src={req.technician.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            req.technician?.name.charAt(0).toUpperCase() || "?"
                                                        )}
                                                    </div>
                                                    <span className="text-muted-foreground font-medium text-sm">
                                                        {req.technician?.name || "Unassigned"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={req.stage} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {req.requestDate ? new Date(req.requestDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {req.requestDate ? new Date(req.requestDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ""}
                                                    </span>
                                                </div>
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
        new: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        in_progress: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        repaired: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        scrap: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    };

    const label = status.replace("_", " ");
    const style = styles[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${style} shadow-sm`}>
            {label}
        </span>
    );
}
