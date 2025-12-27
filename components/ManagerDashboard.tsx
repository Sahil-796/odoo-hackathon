"use client";

import { useMemo, useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    AlertCircle
} from "lucide-react";

interface DashboardStats {
    totalTechnicians: number;
    activeTechnicians: number;
    criticalEquipmentCount: number;
    overdueRequestCount: number;
}

export default function ManagerDashboard({ requests, stats }: { requests: any[], stats: DashboardStats }) {

    const [activeTab, setActiveTab] = useState<"category" | "team">("category");

    const chartData = useMemo(() => {
        const counts = requests.reduce((acc, r) => {
            const key = activeTab === "category"
                ? (r.equipment?.category || "Uncategorized")
                : (r.team?.name || "Unassigned");
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .map(([label, count]) => ({ label, count: count as number }));
    }, [requests, activeTab]);

    return (
        <div className="space-y-6 p-6">

            {/* Dashboard Graph */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-foreground">
                        Requests per {activeTab === "category" ? "Equipment Category" : "Team"}
                    </h3>

                    <div className="flex p-1 bg-muted rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab("category")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "category"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Category
                        </button>
                        <button
                            onClick={() => setActiveTab("team")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "team"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Team
                        </button>
                    </div>
                </div>

                {chartData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                        No data available to chart.
                    </div>
                ) : (
                    <div className="flex items-end gap-8 px-4 pb-2">
                        {chartData.map(({ label, count }, idx) => {
                            // Find max for scaling
                            const max = Math.max(...chartData.map(d => d.count));
                            const heightPercentage = max > 0 ? (count / max) * 100 : 0;
                            const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-red-500", "bg-purple-500"];

                            return (
                                <div key={label} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="h-48 w-full flex items-end justify-center relative">
                                        {/* Background Track */}
                                        <div className="absolute inset-0 bg-muted/20 rounded-t-lg" />

                                        <div
                                            style={{ height: `${heightPercentage}%` }}
                                            className={`w-full max-w-[60px] rounded-t-lg ${colors[idx % colors.length]} opacity-80 group-hover:opacity-100 transition-all duration-300 relative`}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-md whitespace-nowrap z-10 pointer-events-none">
                                                {count} Requests
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center h-10">
                                        <span className="block text-sm font-medium text-foreground truncate max-w-[100px]" title={label}>
                                            {label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Requests List */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                            Recent Requests
                        </h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-muted-foreground font-medium border-b border-border">
                                <tr className="text-muted-foreground font-medium border-b border-border">
                                    <th className="pb-3 pl-2">Request</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Priority</th>
                                    <th className="pb-3">Technician</th>
                                    <th className="pb-3 text-right pr-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requests.slice(0, 5).map((request) => (
                                    <tr key={request.id} className="group hover:bg-muted/30 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">
                                                    {request.subject}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {request.equipment?.name || "No Equipment"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize
                        ${request.stage === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    request.stage === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                                                        request.stage === 'repaired' ? 'bg-emerald-100 text-emerald-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {request.stage.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1.5">
                                                {request.priority > 1 ? (
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                )}
                                                <span className={`${request.priority > 1 ? 'text-red-700 font-medium' : 'text-muted-foreground'}`}>
                                                    {request.priority > 1 ? 'High' : 'Normal'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                    {request.technician?.name?.[0] || "?"}
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {request.technician?.name || "Unassigned"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <button className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                            No requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="flex flex-col gap-4">

                    {/* Critical Equipment */}
                    <div className="bg-card rounded-xl border border-red-500/30 shadow-sm p-6 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                        <div className="absolute inset-0 bg-red-500/5 pointer-events-none group-hover:bg-red-500/10 transition-colors" />
                        <h3 className="text-red-500 font-medium text-sm mb-2 relative z-10">Critical Equipment</h3>
                        <div className="text-3xl font-bold text-foreground relative z-10">{stats.criticalEquipmentCount} Units</div>
                        <div className="text-xs text-red-400 mt-1 relative z-10">(Health &lt; 30%)</div>
                    </div>

                    {/* Technician Load */}
                    <div className="bg-card rounded-xl border border-blue-500/30 shadow-sm p-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                        <h3 className="text-blue-500 font-medium text-sm mb-2 relative z-10">Technician Load</h3>
                        <div className="text-3xl font-bold text-foreground relative z-10">
                            {stats.totalTechnicians > 0 ? Math.round((stats.activeTechnicians / stats.totalTechnicians) * 100) : 0}% Utilized
                        </div>
                        <div className="text-xs text-blue-400 mt-1 relative z-10">
                            {stats.activeTechnicians} / {stats.totalTechnicians} Active
                        </div>
                    </div>

                    {/* Open Requests */}
                    <div className="bg-card rounded-xl border border-emerald-500/30 shadow-sm p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                        <h3 className="text-emerald-500 font-medium text-sm mb-2 relative z-10">Open Requests</h3>
                        <div className="text-3xl font-bold text-foreground relative z-10">{requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap').length} Pending</div>
                        <div className="text-xs text-emerald-400 mt-1 relative z-10">{stats.overdueRequestCount} Overdue</div>
                    </div>

                </div>
            </div>
        </div>
    );
}
