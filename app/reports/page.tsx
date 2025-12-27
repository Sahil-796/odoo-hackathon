import { db } from "@/db";
import { maintenanceRequests, equipment, users } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getCurrentUser } from "@/utils/auth";
import {
    BarChart3,
    CheckCircle2,
    Clock,
    Filter,
    AlertTriangle,
    TrendingUp,
    Activity,
    Wrench,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Hammer
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats(companyId: number) {
    const allRequests = await db.query.maintenanceRequests.findMany({
        where: eq(maintenanceRequests.companyId, companyId),
        with: {
            equipment: true,
            technician: true
        },
        orderBy: [desc(maintenanceRequests.createdAt)]
    });

    const total = allRequests.length;

    // Stage Counts
    const stages = {
        new: allRequests.filter(r => r.stage === 'new').length,
        in_progress: allRequests.filter(r => r.stage === 'in_progress').length,
        repaired: allRequests.filter(r => r.stage === 'repaired').length,
        scrap: allRequests.filter(r => r.stage === 'scrap').length,
    };

    // Priority Counts
    const priorities = [0, 1, 2, 3].map(p => ({
        priority: p,
        count: allRequests.filter(r => (r.priority || 0) === p).length
    }));

    // Average Duration (completed)
    const completed = allRequests.filter(r => r.stage === 'repaired' && r.duration);
    const avgDuration = completed.length > 0
        ? completed.reduce((acc, curr) => acc + (curr.duration || 0), 0) / completed.length
        : 0;

    // --- Advanced Stats ---

    // 1. Equipment Reliability (Most Failures)
    const equipmentStats = new Map<string, { count: number, name: string }>();
    allRequests.forEach(r => {
        if (r.equipment?.name) {
            const current = equipmentStats.get(r.equipment.name) || { count: 0, name: r.equipment.name };
            current.count++;
            equipmentStats.set(r.equipment.name, current);
        }
    });
    const topFaultyEquipment = Array.from(equipmentStats.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // 2. Technician Performance
    const techStats = new Map<string, { name: string, resolved: number, totalDuration: number, avatar?: string | null }>();
    allRequests.forEach(r => {
        if (r.technician?.name) {
            const current = techStats.get(r.technician.name) || {
                name: r.technician.name,
                resolved: 0,
                totalDuration: 0,
                avatar: r.technician.avatarUrl
            };
            if (r.stage === 'repaired') {
                current.resolved++;
                current.totalDuration += (r.duration || 0);
            }
            techStats.set(r.technician.name, current);
        }
    });
    const topTechnicians = Array.from(techStats.values())
        .sort((a, b) => b.resolved - a.resolved)
        .slice(0, 5)
        .map(t => ({
            ...t,
            avgSpeed: t.resolved > 0 ? (t.totalDuration / t.resolved).toFixed(1) : "0.0"
        }));

    // 3. Simple Monthly Trend (Last 6 Months)
    // Group by Month-Year
    const months = new Map<string, number>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        months.set(key, 0); // Initialize
    }

    allRequests.forEach(r => {
        if (r.requestDate) {
            const d = new Date(r.requestDate);
            // Only count if within last ~6 months roughly
            if ((now.getTime() - d.getTime()) < 1000 * 60 * 60 * 24 * 180) {
                const key = d.toLocaleString('default', { month: 'short' });
                if (months.has(key)) {
                    months.set(key, (months.get(key) || 0) + 1);
                }
            }
        }
    });
    const monthlyTrend = Array.from(months.entries()).map(([month, count]) => ({ month, count }));

    return {
        total,
        stages,
        priorities,
        avgDuration,
        topFaultyEquipment,
        topTechnicians,
        monthlyTrend
    };
}

export default async function ReportsPage() {
    const user = await getCurrentUser();

    if (!user || !user.companyId) {
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access</div>;
    }

    const stats = await getStats(user.companyId);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background text-foreground font-sans p-6 pb-20">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/50 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Activity className="w-8 h-8 text-primary" />
                            Maintenance Analytics
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                            Comprehensive overview of equipment health, technician performance, and operational efficiency.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border">
                            Updated: {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Top Level KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard
                        title="Total Requests"
                        value={stats.total}
                        icon={<BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                        subtext="All time volume"
                        color="blue"
                    />
                    <KpiCard
                        title="Active Jobs"
                        value={stats.stages.in_progress}
                        icon={<Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
                        subtext={`${Math.round(percent(stats.stages.in_progress, stats.total))}% of total`}
                        color="orange"
                    />
                    <KpiCard
                        title="Avg. Repair Time"
                        value={`${stats.avgDuration.toFixed(1)}h`}
                        icon={<Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                        subtext="For completed tasks"
                        color="purple"
                    />
                    <KpiCard
                        title="Resolution Rate"
                        value={`${Math.round(percent(stats.stages.repaired, stats.total))}%`}
                        icon={<CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />}
                        subtext="Successfully closed"
                        color="green"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN (8/12) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Monthly Trend Chart */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                                Request Volume Trend (6 Months)
                            </h3>
                            <div className="h-48 flex items-end justify-between gap-4 px-2">
                                {stats.monthlyTrend.map((m, i) => (
                                    <div key={m.month} className="flex-1 flex flex-col items-center gap-3 group">
                                        <div className="relative w-full flex justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md transition-opacity whitespace-nowrap z-10">
                                                {m.count} Requests
                                            </div>
                                            <div
                                                className="w-full max-w-[48px] bg-primary/80 hover:bg-primary rounded-t-sm transition-all duration-500 relative"
                                                style={{ height: `${Math.max((m.count / (Math.max(...stats.monthlyTrend.map(x => x.count)) || 1)) * 100, 4)}%` }} // Scaled height
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">{m.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Equipment Reliability Table */}
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Hammer className="w-5 h-5 text-muted-foreground" />
                                    Most Frequent Failures
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Equipment</th>
                                            <th className="px-6 py-3 text-right">Failure Count</th>
                                            <th className="px-6 py-3 text-right">% of Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {stats.topFaultyEquipment.length === 0 ? (
                                            <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">No data available</td></tr>
                                        ) : (
                                            stats.topFaultyEquipment.map((eq, i) => (
                                                <tr key={eq.name} className="hover:bg-muted/20 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{eq.name}</td>
                                                    <td className="px-6 py-4 text-right">{eq.count}</td>
                                                    <td className="px-6 py-4 text-right text-muted-foreground">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${percent(eq.count, stats.total)}%` }} />
                                                            </div>
                                                            <span className="w-8 text-xs">{Math.round(percent(eq.count, stats.total))}%</span>
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

                    {/* RIGHT COLUMN (4/12) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Status Pipeline */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Request Status</h3>
                            <div className="space-y-5">
                                <PipelineItem label="New" count={stats.stages.new} total={stats.total} color="bg-blue-500" />
                                <PipelineItem label="In Progress" count={stats.stages.in_progress} total={stats.total} color="bg-orange-500" />
                                <PipelineItem label="Repaired" count={stats.stages.repaired} total={stats.total} color="bg-green-500" />
                                <PipelineItem label="Scrap" count={stats.stages.scrap} total={stats.total} color="bg-red-500" />
                            </div>
                        </div>

                        {/* Top Technicians */}
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    Top Technicians
                                </h3>
                            </div>
                            <div className="divide-y divide-border/50">
                                {stats.topTechnicians.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground text-sm">No technician data.</div>
                                ) : (
                                    stats.topTechnicians.map((tech, i) => (
                                        <div key={tech.name} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden">
                                                    {tech.avatar ? <img src={tech.avatar} className="w-full h-full object-cover" /> : tech.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{tech.name}</p>
                                                    <p className="text-xs text-muted-foreground">{tech.resolved} resolved</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono font-medium">{tech.avgSpeed}h</p>
                                                <p className="text-[10px] text-muted-foreground uppercase opacity-75">Avg Time</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Priority Distribution */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-muted-foreground" />
                                By Priority
                            </h3>
                            <div className="flex items-end justify-between gap-2 h-32 pt-4">
                                {stats.priorities.map(p => (
                                    <div key={p.priority} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className={`w-full rounded-t transition-all duration-500 ${p.priority === 3 ? 'bg-red-500' :
                                                    p.priority === 2 ? 'bg-orange-500' :
                                                        p.priority === 1 ? 'bg-blue-400' : 'bg-gray-300'
                                                }`}
                                            style={{ height: `${Math.max(percent(p.count, stats.total), 5)}%` }} // Min height 5%
                                        />
                                        <div className="text-center">
                                            <div className="text-xs font-bold">{p.count}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">
                                                {['Low', 'Med', 'Hi', 'Urg'][p.priority]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon, subtext, color }: { title: string, value: string | number, icon: React.ReactNode, subtext: string, color: string }) {
    // Dynamic color classes map
    const bgMap: Record<string, string> = {
        blue: "hover:border-blue-500/50",
        orange: "hover:border-orange-500/50",
        purple: "hover:border-purple-500/50",
        green: "hover:border-green-500/50",
    };

    return (
        <div className={`bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-300 ${bgMap[color] || ''} group`}>
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <div className="p-2 bg-muted/30 rounded-lg w-fit group-hover:bg-muted transition-colors">
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h4 className="text-2xl font-bold mt-1 text-foreground">{value}</h4>
                    </div>
                </div>
                {/* Visual decorative element */}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    KPI
                </span>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {subtext}
                </p>
            </div>
        </div>
    );
}

function PipelineItem({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
    const percentage = percent(count, total);
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-muted-foreground">{label}</span>
                <span className="font-bold">{count}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function percent(part: number, total: number) {
    if (total === 0) return 0;
    return (part / total) * 100;
}
