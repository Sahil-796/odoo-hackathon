"use client";

import { useMemo, useState } from "react";
import {
    Search,
    Filter,
    AlertCircle,
    Wrench,
    Users,
    BarChart3,
    Archive,
} from "lucide-react";

interface DashboardStats {
    totalTechnicians: number;
    activeTechnicians: number;
    criticalEquipmentCount: number;
    overdueRequestCount: number;
}

export default function ManagerDashboard({ requests, stats }: { requests: any[], stats: DashboardStats }) {

    const [activeTab, setActiveTab] = useState<"category" | "team">("category");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRequests = requests.filter(r => {
        const query = searchQuery.toLowerCase();
        return (
            r.subject?.toLowerCase().includes(query) ||
            r.equipment?.name?.toLowerCase().includes(query) ||
            r.technician?.name?.toLowerCase().includes(query)
        );
    });

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
        <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Overview of maintenance operations and performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md">
                        Manager View
                    </div>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Critical Equipment */}
                <div className="group relative overflow-hidden bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-red-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Critical Equipment</p>
                            <h3 className="text-3xl font-bold text-foreground tracking-tight">{stats.criticalEquipmentCount}</h3>
                            <div className="flex items-center gap-1.5 mt-2 bg-red-100/10 w-fit px-2 py-0.5 rounded text-red-600 text-xs font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Health &lt; 30%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/10 text-red-600 rounded-md border border-red-200/20 group-hover:scale-110 transition-transform">
                            <Wrench className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Technician Load */}
                <div className="group relative overflow-hidden bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Technician Load</p>
                            <h3 className="text-3xl font-bold text-foreground tracking-tight">
                                {stats.totalTechnicians > 0 ? Math.round((stats.activeTechnicians / stats.totalTechnicians) * 100) : 0}%
                            </h3>
                            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-600/80">
                                <Users className="w-3.5 h-3.5" />
                                <span>{stats.activeTechnicians} / {stats.totalTechnicians} Active</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-600 rounded-md border border-blue-200/20 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Open Requests */}
                <div className="group relative overflow-hidden bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Pending Requests</p>
                            <h3 className="text-3xl font-bold text-foreground tracking-tight">
                                {requests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap').length}
                            </h3>
                            <div className="mt-2 text-xs font-medium text-emerald-600/80 flex items-center gap-1.5">
                                <span className={stats.overdueRequestCount > 0 ? "text-amber-500 font-bold" : ""}>
                                    {stats.overdueRequestCount} Overdue
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-md border border-emerald-200/20 group-hover:scale-110 transition-transform">
                            <Archive className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Charts Section */}
                <div className="lg:col-span-1 bg-card/30 backdrop-blur-sm border border-border/60 rounded-lg shadow-sm flex flex-col h-[500px]">
                    <div className="p-5 border-b border-border/60 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            Request Analytics
                        </h3>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <div className="bg-muted/50 p-1 rounded-md mb-6 flex w-full">
                            <button
                                onClick={() => setActiveTab("category")}
                                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all shadow-sm ${activeTab === "category" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground/80 hover:bg-background/50"}`}
                            >
                                Category
                            </button>
                            <button
                                onClick={() => setActiveTab("team")}
                                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-sm transition-all shadow-sm ${activeTab === "team" ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground/80 hover:bg-background/50"}`}
                            >
                                Team
                            </button>
                        </div>

                        {chartData.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-md p-6 bg-muted/5">
                                <BarChart3 className="w-8 h-8 mb-2 opacity-20" />
                                <span>No data available to chart.</span>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-end justify-between gap-3 px-2 pb-2">
                                {chartData.map(({ label, count }, idx) => {
                                    const max = Math.max(...chartData.map(d => d.count), 1);
                                    const heightPercentage = Math.max((count / max) * 100, 5); // Min height 5% for visuals
                                    const colors = ["bg-primary", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500", "bg-pink-500"];

                                    return (
                                        <div key={label} className="group relative flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                            <div className="w-full relative flex flex-col justify-end" style={{ height: '100%' }}>
                                                <div
                                                    className={`w-full rounded-t-md ${colors[idx % colors.length]} opacity-80 group-hover:opacity-100 transition-all duration-500 relative`}
                                                    style={{ height: `${heightPercentage}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none transform translate-y-2 group-hover:translate-y-0 duration-200">
                                                        {count} Requests
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider truncate max-w-full text-center" title={label}>
                                                {label.split(' ')[0]} {/* Show first word only for concise labels */}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-border/40 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold opacity-60">
                            {activeTab === "category" ? "Requests by Category" : "Requests by Team"}
                        </div>
                    </div>
                </div>

                {/* Recent Requests Table */}
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-sm border border-border/60 rounded-lg shadow-sm flex flex-col h-[500px]">
                    <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                <Filter className="w-4 h-4" />
                            </div>
                            <h2 className="font-semibold text-foreground">Recent Requests</h2>
                        </div>
                        <div className="relative w-full sm:w-64 group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by subject, equipment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border/60 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Request</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Priority</th>
                                    <th className="px-6 py-3 font-medium text-right">Technician</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredRequests.slice(0, 6).map((request) => (
                                    <tr key={request.id} className="group hover:bg-muted/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {request.subject}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                                    <span className="truncate max-w-[150px]">{request.equipment?.name || "No Equipment"}</span>
                                                    {request.equipment?.isScrapped && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-600 border border-red-200/50 uppercase tracking-tighter">
                                                            SCRAPPED
                                                        </span>
                                                    )}
                                                    <span className="text-border">•</span>
                                                    <span className="text-muted-foreground/70">{request.company?.name || "Internal"}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border
                                                ${request.stage === 'new' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                    request.stage === 'in_progress' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                        request.stage === 'repaired' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                            'bg-gray-500/10 text-gray-600 border-gray-500/20'}`}>
                                                {request.stage.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.priority > 1 ? (
                                                <div className="flex items-center gap-1.5 text-red-600 bg-red-500/5 px-2 py-1 rounded w-fit border border-red-500/10">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-semibold">High</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-muted-foreground px-2 py-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    <span className="text-xs font-medium">Normal</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-medium text-foreground">{request.technician?.name || "Unassigned"}</span>
                                                </div>
                                                <div className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold ring-1 ring-border/50
                                                    ${request.technician?.name ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                    {request.technician?.name?.[0] || "?"}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-muted-foreground bg-muted/5 border-dashed border-2 border-border/50 rounded-lg m-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-8 h-8 opacity-20" />
                                                <span>No matching requests found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
